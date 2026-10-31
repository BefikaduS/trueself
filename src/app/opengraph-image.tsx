import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "Trueself — Personal Reflection Experience";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#F7F0E9",
          backgroundImage:
            "radial-gradient(circle at 88% 50%, rgba(237, 108, 48, 0.09) 0%, transparent 60%), radial-gradient(circle at 10% 20%, rgba(237, 108, 48, 0.04) 0%, transparent 40%)",
          padding: "54px 64px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          boxSizing: "border-box",
        }}
      >
        {/* Subtle geometric framing border */}
        <div
          style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            right: "24px",
            bottom: "24px",
            border: "1px solid rgba(26, 22, 20, 0.08)",
            borderRadius: "16px",
            pointerEvents: "none",
          }}
        />

        {/* Top bar: Brand lockup + Tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Logo Mark + Wordmark */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <svg
              width="44"
              height="44"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="14.5" fill="#ED6C30" />
              <path
                d="M 16 5.5 C 10.5 10.8 10.5 21.2 16 26.5 C 21.5 21.2 21.5 10.8 16 5.5 Z"
                fill="#FFFAF5"
              />
              <circle
                cx="16"
                cy="16"
                r="5.4"
                stroke="#ED6C30"
                strokeWidth="0.8"
                strokeDasharray="1.5 2"
                opacity="0.4"
              />
              <circle cx="16" cy="16" r="2.8" fill="#ED6C30" />
              <circle cx="16" cy="9.3" r="1.1" fill="#ED6C30" />
            </svg>
            <span
              style={{
                fontSize: "30px",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "#1A1614",
              }}
            >
              Trueself
            </span>
          </div>

          {/* Category Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "7px 16px",
              borderRadius: "9999px",
              backgroundColor: "rgba(237, 108, 48, 0.1)",
              border: "1px solid rgba(237, 108, 48, 0.2)",
              color: "#C8531D",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            A Personal Reflection Experience
          </div>
        </div>

        {/* Center content row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            marginTop: "16px",
            marginBottom: "16px",
          }}
        >
          {/* Main Text column */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "680px",
            }}
          >
            <h1
              style={{
                fontSize: "56px",
                lineHeight: 1.08,
                fontWeight: 600,
                color: "#1A1614",
                margin: "0 0 20px 0",
                letterSpacing: "-0.025em",
              }}
            >
              Meet the person behind your decisions.
            </h1>
            <p
              style={{
                fontSize: "22px",
                lineHeight: 1.45,
                color: "#6B5F57",
                margin: 0,
                maxWidth: "620px",
              }}
            >
              Six thoughtful questions. One honest look at your patterns,
              strengths, and the things you might be overlooking.
            </p>
          </div>

          {/* Right visual: The Large Inward Lens reflection seal */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              width: "280px",
              height: "280px",
            }}
          >
            {/* Concentric ambient ripple rings */}
            <div
              style={{
                position: "absolute",
                width: "260px",
                height: "260px",
                borderRadius: "50%",
                border: "1px dashed rgba(237, 108, 48, 0.25)",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "210px",
                height: "210px",
                borderRadius: "50%",
                border: "1px solid rgba(237, 108, 48, 0.18)",
              }}
            />

            {/* Inward Lens Vector Emblem */}
            <svg
              width="156"
              height="156"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                filter: "drop-shadow(0 14px 28px rgba(237, 108, 48, 0.24))",
              }}
            >
              <circle cx="16" cy="16" r="14.5" fill="#ED6C30" />
              <path
                d="M 16 5.5 C 10.5 10.8 10.5 21.2 16 26.5 C 21.5 21.2 21.5 10.8 16 5.5 Z"
                fill="#FFFAF5"
              />
              <circle
                cx="16"
                cy="16"
                r="5.4"
                stroke="#ED6C30"
                strokeWidth="0.8"
                strokeDasharray="1.5 2"
                opacity="0.45"
              />
              <circle cx="16" cy="16" r="2.8" fill="#ED6C30" />
              <circle cx="16" cy="9.3" r="1.1" fill="#ED6C30" />
            </svg>
          </div>
        </div>

        {/* Bottom metadata row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(26, 22, 20, 0.08)",
            paddingTop: "22px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
              fontSize: "16px",
              color: "#857870",
              fontWeight: 500,
            }}
          >
            <span>Private by default</span>
            <span>•</span>
            <span>No account required</span>
            <span>•</span>
            <span>~3 minutes</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "18px",
              fontWeight: 600,
              color: "#ED6C30",
              letterSpacing: "-0.01em",
            }}
          >
            trueself.me →
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
