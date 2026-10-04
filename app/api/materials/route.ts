import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("materials").select("id, name, slug").order("name");
    
    if (error) throw error;
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching materials:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
