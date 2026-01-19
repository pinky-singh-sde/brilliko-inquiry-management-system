import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, full_name, role, branch_id } = body;

  if (!email || !password || !role) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1️⃣ Create auth user
  const { data: userData, error: userError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (userError || !userData.user) {
    return NextResponse.json(
      { error: userError?.message },
      { status: 400 }
    );
  }

  // 2️⃣ Insert profile
//   const { error: profileError } = await supabaseAdmin
//     .from("profiles")
//     .insert({
//       id: userData.user.id,
//       full_name,
//       role,
//       branch_id: branch_id || null,
//     });

//   if (profileError) {
//     return NextResponse.json(
//       { error: "Profile creation failed" },
//       { status: 500 }
//     );
//   }

// 2️⃣ Insert / Update profile (FIX)
const { error: profileError } = await supabaseAdmin
  .from("profiles")
  .upsert(
    {
      id: userData.user.id,
      full_name,
      role,
      branch_id: branch_id || null,
    },
    { onConflict: "id" }
  );

if (profileError) {
  return NextResponse.json(
    { error: profileError.message },
    { status: 500 }
  );
}


  
  return NextResponse.json({ success: true });
}
