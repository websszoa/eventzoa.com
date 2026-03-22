import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { origin } = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  const baseUrl = !isLocalEnv && forwardedHost ? `https://${forwardedHost}` : origin;

  const clientId = process.env.NAVER_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "NAVER_CLIENT_ID is not configured." }, { status: 500 });
  }

  // CSRF 방지용 state 생성
  const state = crypto.randomUUID();
  const redirectUri = `${baseUrl}/api/auth/naver/callback`;

  const naverAuthUrl = new URL("https://nid.naver.com/oauth2.0/authorize");
  naverAuthUrl.searchParams.set("response_type", "code");
  naverAuthUrl.searchParams.set("client_id", clientId);
  naverAuthUrl.searchParams.set("redirect_uri", redirectUri);
  naverAuthUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(naverAuthUrl.toString());

  // state를 httpOnly 쿠키에 저장 (10분 유효)
  response.cookies.set("naver_oauth_state", state, {
    httpOnly: true,
    secure: !isLocalEnv,
    sameSite: "lax",
    maxAge: 60 * 10,
    path: "/",
  });

  return response;
}
