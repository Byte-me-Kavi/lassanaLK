import { NextResponse } from "next/server";
import { createOrderSchema } from "@/lib/validators/checkout";
import { createClient } from "@/lib/supabase/server";

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
    for (const item of validatedData.items) {
      const dbProduct = products?.find((p: any) => p.id === item.productId);
      
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

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: orderData.id,
      message: "Order placed successfully"
    });

  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json(
      { error: "Failed to create order. Invalid data." },
      { status: 400 }
    );
  }
}
