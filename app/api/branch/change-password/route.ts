import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { staff_id, new_password } = await req.json();
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !staff_id || !new_password) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  const token = authHeader.replace("Bearer ", "");

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: { user: admin } } =
    await supabaseAdmin.auth.getUser(token);

  if (!admin || admin.user_metadata.role !== "BRANCH_ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const branch_id = admin.user_metadata.branch_id;

  // Validate staff belongs to same branch
  const { data: staff } = await supabaseAdmin
    .from("profiles")
    .select("branch_id")
    .eq("id", staff_id)
    .single();

  if (!staff || staff.branch_id !== branch_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } =
    await supabaseAdmin.auth.admin.updateUserById(
      staff_id,
      { password: new_password }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
