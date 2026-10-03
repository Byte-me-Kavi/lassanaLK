import { NextResponse } from "next/server";
import { createOrderSchema } from "@/lib/validators/checkout";
import { createClient } from "@/lib/supabase/server";
import { createCodClient } from "@/lib/supabase/cod-client";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = createOrderSchema.parse(body);

    // Calculate total dynamically if we want, but trusting client for now for simplicity
    // or calculate from DB items in a real app.
    let subtotal = 0;
    for (const item of validatedData.items) {
      // NOTE: In production, fetch price from DB here.
      // We will trust the client provided quantity and price for now.
      // Wait, client payload didn't send price, so we MUST fetch from DB.
    }

    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomHex = Math.floor(Math.random() * 0xffff).toString(16).toUpperCase().padStart(4, "0");
    const orderNumber = `LLK-${dateStr}-${randomHex}`;

    const supabase = await createClient();
    
    // 1. Fetch product prices from DB
    const productIds = validatedData.items.map(i => i.productId);
    const { data: products } = await supabase.from("products").select("id, price, name, stock_quantity").in("id", productIds);
    
    let calculatedSubtotal = 0;
    
    // Check stock and calculate total
    for (const item of validatedData.items) {
      const dbProduct = products?.find((p: any) => p.id === item.productId);
      if (!dbProduct) throw new Error(`Product not found: ${item.productId}`);
      if (dbProduct.stock_quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${dbProduct.name}`);
      }
      calculatedSubtotal += (dbProduct.price * item.quantity);
    }
    
    const deliveryFee = 350; // Hardcoded or fetch from site_settings
    const total = calculatedSubtotal + deliveryFee;

    // 2. Insert Order
    const { data: orderData, error: orderError } = await supabase.from("orders").insert({
      order_number: orderNumber,
      customer_name: validatedData.customer.customerName,
      customer_phone: validatedData.customer.customerPhone,
      customer_whatsapp: validatedData.customer.customerWhatsapp || null,
      customer_email: validatedData.customer.customerEmail || null,
      address: validatedData.customer.address,
      city: validatedData.customer.city,
      district: validatedData.customer.district,
      postal_code: validatedData.customer.postalCode || null,
      subtotal: calculatedSubtotal,
      delivery_fee: deliveryFee,
      total: total,
      payment_method: 'COD',
      status: 'PENDING',
      notes: validatedData.customer.notes || null,
    }).select().single();

    if (orderError) throw orderError;

    // 3. Insert Order Items & Deduct Stock
    const productDescriptions: string[] = [];
    for (const item of validatedData.items) {
      const dbProduct = products?.find((p: any) => p.id === item.productId);
      
      // Build description for COD system
      let itemDesc = `${dbProduct?.name || "Unknown"} x${item.quantity}`;
      if (item.customizations && item.customizations.length > 0) {
        const customParts = item.customizations.map(c => `${c.fieldLabel}: ${c.value}`);
        itemDesc += ` (${customParts.join(", ")})`;
      }
      productDescriptions.push(itemDesc);

      const { data: orderItemData, error: itemError } = await supabase.from("order_items").insert({
        order_id: orderData.id,
        product_id: item.productId,
        product_name: dbProduct?.name || "Unknown",
        price: dbProduct?.price || 0,
        quantity: item.quantity,
        total: (dbProduct?.price || 0) * item.quantity
      }).select().single();
      
      if (itemError) throw itemError;

      // 4. Insert Customizations
      if (item.customizations && item.customizations.length > 0) {
        const customizationsToInsert = item.customizations.map(c => ({
          order_item_id: orderItemData.id,
          field_name: c.fieldName,
          field_label: c.fieldLabel,
          value: c.value
        }));
        const { error: customError } = await supabase.from("order_item_customizations").insert(customizationsToInsert);
        if (customError) throw customError;
      }

      // Deduct stock
      await supabase.rpc('decrement_stock', { p_id: item.productId, qty: item.quantity }); // Need RPC for this, or just do an update
      await supabase.from("products").update({
        stock_quantity: (dbProduct?.stock_quantity || 0) - item.quantity
      }).eq("id", item.productId);
    }

    // =========================================================
    // 5. Create order in COD Order Management System
    // =========================================================
    // The COD system auto-assigns waybill numbers via a DB trigger.
    // We insert the order there and get back the waybill_id.
    // This is non-blocking — if it fails, the main order still succeeds.
    // =========================================================
    let waybillId: number | null = null;
    try {
      const codSupabase = createCodClient();

      // Build the full delivery address for the COD system
      const fullAddress = [
        validatedData.customer.address,
        validatedData.customer.city,
        validatedData.customer.district,
        validatedData.customer.postalCode,
      ].filter(Boolean).join(", ");

      // Insert order into COD system — waybill_id is auto-assigned by trigger
      const { data: codOrder, error: codError } = await codSupabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          receiver_name: validatedData.customer.customerName,
          delivery_address: fullAddress,
          district_name: validatedData.customer.district,
          city: validatedData.customer.city,
          receiver_phone: validatedData.customer.customerPhone,
          cod: total,
          description: productDescriptions.join(" | "),
          actual_value: calculatedSubtotal,
          manager_id: "61bd052f-c02e-455d-87f8-8c0a9545c145" // Specific manager for automated Lassana LK orders
        })
        .select("waybill_id")
        .single();

      if (codError) {
        console.error("[COD Integration] Failed to create COD order:", codError);
      } else {
        waybillId = codOrder?.waybill_id ?? null;
        console.log(`[COD Integration] Order ${orderNumber} created with waybill: ${waybillId}`);

        // Update the Lassana LK order with the waybill ID for reference
        if (waybillId) {
          await supabase
            .from("orders")
            .update({ waybill_id: waybillId })
            .eq("id", orderData.id);
        }
      }
    } catch (codErr) {
      // Log but don't fail the main order
      console.error("[COD Integration] Error:", codErr);
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: orderData.id,
      waybillId,
      message: "Order placed successfully"
    }, { headers: corsHeaders });

  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create order. Invalid data." },
      { status: 400, headers: corsHeaders }
    );
  }
}

