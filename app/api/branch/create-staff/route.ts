import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, full_name, role } = body;

  if (!email || !password || !role || !full_name) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  // 🔐 Admin client (SERVICE ROLE KEY)
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1️⃣ Get creator (branch admin)
  const authHeader = req.headers.get("authorization")!;
  const token = authHeader.replace("Bearer ", "");

  const {
    data: { user: creator },
  } = await supabaseAdmin.auth.getUser(token);

  if (!creator) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const branch_id =
    creator.user_metadata.branch_id;

  if (!branch_id) {
    return NextResponse.json(
      { error: "Branch not found" },
      { status: 400 }
    );
  }

  // 2️⃣ Create auth user
  const { data: newUser, error } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role,
        branch_id,
      },
    });

  if (error || !newUser.user) {
    return NextResponse.json(
      { error: error?.message },
      { status: 400 }
    );
  }

  // 3️⃣ Insert profile row
  await supabaseAdmin.from("profiles").insert({
    id: newUser.user.id,
    full_name,
    role,
    branch_id,
  });

  return NextResponse.json({ success: true });
}
