import { ImageResponse } from "next/og";

export const alt = "EventZoa - Discover festivals across Korea";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        background: "#071b3b",
        color: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "1040px",
          flexDirection: "column",
          padding: "72px",
          border: "2px solid rgba(147,197,253,0.35)",
          borderRadius: "40px",
          background: "linear-gradient(135deg, #0b2450 0%, #123f84 100%)",
        }}
      >
        <div style={{ display: "flex", color: "#93c5fd", fontSize: 28 }}>
          KOREA FESTIVAL GUIDE
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "28px",
            fontSize: 92,
            fontWeight: 800,
            letterSpacing: "-4px",
          }}
        >
          EventZoa
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "20px",
            color: "#dbeafe",
            fontSize: 38,
          }}
        >
          Discover festivals across Korea
        </div>
      </div>
    </div>,
    size,
  );
}
