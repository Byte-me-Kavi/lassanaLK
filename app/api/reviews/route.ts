import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { product_id, customer_name, rating, review_text } = body;

    if (!product_id || !customer_name || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("reviews").insert([{
      product_id,
      customer_name,
      rating,
      review_text,
      is_approved: false
    }]);

    if (error) {
      console.error("Database insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Failed to submit review:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
