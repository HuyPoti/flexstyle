import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  let next = searchParams.get("next") ?? "/";
  if (!next.startsWith("/")) next = "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.session?.user) {
      const user = data.session.user;

      // Sync to backend
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/taikhoan/dangky`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            DisplayName: user.user_metadata.name,
            MaTK: user.id,
            Email: user.email,
            Avatar: user.user_metadata.avatar_url,
            Username: user.email?.split("@")[0],
            Status: "ACTIVE",
            VAITRO: "KH",
          }),
        });
      } catch (apiError) {
        console.error("Error calling backend API:", apiError);
      }

      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) return NextResponse.redirect(`${origin}${next}`);
      if (forwardedHost)
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
