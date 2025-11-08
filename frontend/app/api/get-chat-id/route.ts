import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function GET() {
  try {
    let chatId = "";
    let exists = true;

    while (exists) {
      chatId = "chat_" + Math.random().toString(36).substring(2, 10);
      const { data, error } = await supabase
        .from("n8n_chat_histories")
        .select("session_id")
        .eq("session_id", chatId)
        .limit(1);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      if (!data || data.length === 0) exists = false;
    }

    return NextResponse.json({ chatId });
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 500 }
    );
  }
}
