export async function GET(request: Request) {
  const address = new URL(request.url).searchParams.get("address")?.trim();
  const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
  const clientSecret = process.env.NAVER_MAP_CLIENT_SECRET;

  if (!address) {
    return Response.json({ message: "주소가 필요합니다." }, { status: 400 });
  }

  if (!clientId || !clientSecret) {
    return Response.json(
      { message: "네이버 지도 API 설정이 필요합니다." },
      { status: 503 },
    );
  }

  const url = new URL("https://maps.apigw.ntruss.com/map-geocode/v2/geocode");
  url.searchParams.set("query", address);
  url.searchParams.set("count", "1");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "x-ncp-apigw-api-key-id": clientId,
      "x-ncp-apigw-api-key": clientSecret,
    },
    next: { revalidate: 86400 },
  });

  if (!response.ok) {
    return Response.json(
      { message: "주소를 좌표로 변환하지 못했습니다." },
      { status: response.status },
    );
  }

  const data = (await response.json()) as {
    addresses?: Array<{ x: string; y: string }>;
  };
  const location = data.addresses?.[0];

  if (!location) {
    return Response.json(
      { message: "주소에 해당하는 위치가 없습니다." },
      { status: 404 },
    );
  }

  return Response.json({
    latitude: Number(location.y),
    longitude: Number(location.x),
  });
}
