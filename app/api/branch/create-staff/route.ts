
// import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";

// export async function POST(req: Request) {
//   try {
//     const { email, password, full_name, role } = await req.json();

//     if (!email || !password || !full_name || !role) {
//       return NextResponse.json(
//         { error: "Missing fields" },
//         { status: 400 }
//       );
//     }

//     // 🔐 Service role client (SERVER ONLY)
//     const supabaseAdmin = createClient(
//       process.env.NEXT_PUBLIC_SUPABASE_URL!,
//       process.env.SUPABASE_SERVICE_ROLE_KEY!
//     );

//     // 1️⃣ Read JWT
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader) {
//       return NextResponse.json({ error: "No token" }, { status: 401 });
//     }

//     const token = authHeader.replace("Bearer ", "");

//     // 2️⃣ Validate creator
//     const {
//       data: { user: creator },
//       error: authError,
//     } = await supabaseAdmin.auth.getUser(token);

//     if (authError || !creator) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     // 🔎 Fetch role + branch from profiles (SOURCE OF TRUTH)
//     const { data: profile, error: profileFetchError } =
//       await supabaseAdmin
//         .from("profiles")
//         .select("role, branch_id")
//         .eq("id", creator.id)
//         .single();

//     if (profileFetchError || !profile) {
//       return NextResponse.json(
//         { error: "Profile not found" },
//         { status: 403 }
//       );
//     }

//     // 🚫 Only branch admin allowed
//     if (profile.role !== "BRANCH_ADMIN") {
//       return NextResponse.json(
//         { error: "Forbidden" },
//         { status: 403 }
//       );
//     }

//     const branch_id = profile.branch_id;
//     if (!branch_id) {
//       return NextResponse.json(
//         { error: "Branch not found" },
//         { status: 400 }
//       );
//     }

//     // 🛑 Restrict roles branch admin can create
//     const allowedRoles = ["COUNSELOR", "RECEPTIONIST"];
//     if (!allowedRoles.includes(role)) {
//       return NextResponse.json(
//         { error: "Invalid role" },
//         { status: 403 }
//       );
//     }


    

//     // 3️⃣ Create staff auth user
//     const { data: newUser, error: createError } =
//       await supabaseAdmin.auth.admin.createUser({
//         email,
//         password,
//         email_confirm: true,
//         user_metadata: {
//           branch_id, // optional
//         },
//       });

//     if (createError || !newUser.user) {
//       return NextResponse.json(
//         { error: createError?.message },
//         { status: 400 }
//       );
//     }

//     // 4️⃣ Insert profile
//     // const { error: profileError } = await supabaseAdmin
//     //   .from("profiles")
//     //   .insert({
//     //     id: newUser.user.id,
//     //     full_name,
//     //     role,
//     //     branch_id,
//     //     is_active: true,
//     //   });


//     // const {error : profileError} = await supabaseAdmin
//     // .from("profiles")
//     // .update({
//     //   full_name,
//     //   role,
//     //   branch_id,
//     //   is_active: true,
//     // })
//     // .eq("id", newUser.user.id);


//     const { error: profileError } = await supabaseAdmin
//       .from("profiles")
//       .upsert({
//         id: newUser.user.id,
//         full_name,
//         role,
//         branch_id: profile.branch_id,
//         is_active: true,
//       });


//     if (profileError) {
//       return NextResponse.json(
//         { error: profileError.message },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json({ success: true });
//   } catch (err) {
//     return NextResponse.json(
//       { error: "Server error" },
//       { status: 500 }
//     );
//   }
// }




import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { email, password, full_name, role } = await req.json();

    if (!email || !password || !full_name || !role) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 🔐 Read JWT
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // 👤 Validate creator
    const {
      data: { user: creator },
    } = await supabaseAdmin.auth.getUser(token);

    if (!creator) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔎 Fetch creator profile
    const { data: profile, error: profileError } =
      await supabaseAdmin
        .from("profiles")
        .select("role, branch_id")
        .eq("id", creator.id)
        .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 403 }
      );
    }

    if (profile.role !== "BRANCH_ADMIN") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    if (!profile.branch_id) {
      return NextResponse.json(
        { error: "Branch not assigned" },
        { status: 400 }
      );
    }

    // 🛑 Allowed roles
    const allowedRoles = ["COUNSELOR", "RECEPTIONIST"];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 403 }
      );
    }

    // 🚨 DUPLICATE EMAIL CHECK
    const { data: users } =
      await supabaseAdmin.auth.admin.listUsers();

    const emailExists = users?.users?.some(
      (u) => u.email === email
    );

    if (emailExists) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // 👤 Create auth user
    const { data: newUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (createError || !newUser.user) {
      return NextResponse.json(
        { error: createError?.message || "User creation failed" },
        { status: 400 }
      );
    }

    // ✅ UPSERT profile
    const { error: upsertError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: newUser.user.id,
        full_name,
        role,
        branch_id: profile.branch_id,
        is_active: true,
      });

    if (upsertError) {
      return NextResponse.json(
        { error: upsertError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
