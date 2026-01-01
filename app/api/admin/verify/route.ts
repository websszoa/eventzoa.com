import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { password } = (await request.json()) as { password?: string };
    const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        {
          success: false,
          message: "서버에 ADMIN_PASSWORD가 설정되지 않았습니다.",
        },
        { status: 500 }
      );
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, message: "비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ success: true });

    res.cookies.set("admin_authenticated", "true", {
      path: "/admin",
      maxAge: 60 * 60, // 1시간
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch {
    return NextResponse.json(
      { success: false, message: "오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
