import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendAdminContactEmail } from "@/lib/email";
import { contactSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: "로그인이 필요합니다." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "입력값이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    const { error } = await supabase.from("contacts").insert({
      user_id: user.id,
      user_email: user.email ?? parsed.data.user_email,
      message: parsed.data.message,
      status: "pending",
    });

    if (error) {
      throw error;
    }

    try {
      await sendAdminContactEmail();
    } catch (mailError) {
      console.error("문의 등록 메일 발송 실패:", mailError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("문의 등록 실패:", error);

    return NextResponse.json(
      { message: "문의 접수 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
