import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendAdminFirstLoginEmail } from "@/lib/email";

interface NaverUserResponse {
  resultcode: string;
  message: string;
  response: {
    id: string;
    email: string;
    name?: string;
    nickname?: string;
    profile_image?: string;
  };
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const baseUrl = !isLocalEnv && forwardedHost ? `https://${forwardedHost}` : origin;

  const failUrl = new URL("/", baseUrl);
  failUrl.searchParams.set("error", "error_code");

  const clearState = (res: NextResponse) => {
    res.cookies.delete("naver_oauth_state");
    return res;
  };

  // 1. state 검증 (CSRF 방지)
  const savedState = request.cookies.get("naver_oauth_state")?.value;
  if (!code || !state || state !== savedState) {
    return clearState(NextResponse.redirect(failUrl));
  }

  // 2. code → accessToken 교환
  const redirectUri = `${baseUrl}/api/auth/naver/callback`;
  const tokenRes = await fetch("https://nid.naver.com/oauth2.0/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.NAVER_CLIENT_ID!,
      client_secret: process.env.NAVER_CLIENT_SECRET!,
      code,
      state,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return clearState(NextResponse.redirect(failUrl));
  }

  // 3. 네이버 사용자 정보 요청
  const userRes = await fetch("https://openapi.naver.com/v1/nid/me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const userData: NaverUserResponse = await userRes.json();
  if (userData.resultcode !== "00" || !userData.response.email) {
    return clearState(NextResponse.redirect(failUrl));
  }

  const { email, name, nickname, profile_image } = userData.response;
  const fullName = name ?? nickname ?? "";

  // 4. Supabase 유저 생성 또는 조회
  let isNewUser = false;

  const { error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    email_confirm: true,
    app_metadata: { provider: "naver", providers: ["naver"] },
    user_metadata: { full_name: fullName, avatar_url: profile_image },
  });

  if (!createError) {
    isNewUser = true;
  } else {
    // 기존 유저 확인 - 이메일로 조회 (admin REST API 직접 호출)
    const findRes = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users?filter=${encodeURIComponent(email)}`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
      },
    );
    const { users } = await findRes.json();
    if (!users?.length) return clearState(NextResponse.redirect(failUrl));

    // 기존 유저도 provider를 naver로 업데이트
    await supabaseAdmin.auth.admin.updateUserById(users[0].id, {
      app_metadata: { provider: "naver", providers: ["naver"] },
    });
  }

  // 5. 매직링크 토큰 생성 → 세션 교환 (createSession 대신 안정적인 방식)
  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (linkError || !linkData?.properties?.hashed_token) {
    return clearState(NextResponse.redirect(failUrl));
  }

  // 6. SSR 클라이언트에서 토큰으로 세션 설정 (쿠키 저장)
  const supabase = await createClient();
  const { error: otpError } = await supabase.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: "email",
  });

  if (otpError) {
    return clearState(NextResponse.redirect(failUrl));
  }

  // 7. 탈퇴 계정 확인
  const { data: isDeleted } = await supabase.rpc("is_my_account_deleted");
  if (isDeleted === true) {
    await supabase.auth.signOut();
    const deletedUrl = new URL("/", baseUrl);
    deletedUrl.searchParams.set("error", "deleted_account");
    return clearState(NextResponse.redirect(deletedUrl));
  }

  // 8. 앱 내부 프로필은 네이버 가입자로 일관되게 동기화
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  if (currentUser?.id) {
    const { error: profileSyncError } = await supabase
      .from("profiles")
      .update({
        email,
        full_name: fullName,
        avatar_url: profile_image ?? null,
        signup_provider: "naver",
      })
      .eq("id", currentUser.id);

    if (profileSyncError) {
      console.error("네이버 프로필 동기화 실패:", profileSyncError);
    }
  }

  // 9. 신규 가입자 관리자 알림 메일
  if (isNewUser) {
    try {
      await sendAdminFirstLoginEmail();
    } catch (mailError) {
      console.error("관리자 가입 알림 메일 발송 실패:", mailError);
    }
  }

  // 10. 방문 횟수 증가
  try {
    await supabase.rpc("increment_visit_count");
  } catch (rpcError) {
    console.error("방문 횟수 증가 실패:", rpcError);
  }

  // 11. 로그인 성공 리다이렉트
  const successUrl = new URL("/", baseUrl);
  successUrl.searchParams.set("welcome", "true");
  return clearState(NextResponse.redirect(successUrl));
}
