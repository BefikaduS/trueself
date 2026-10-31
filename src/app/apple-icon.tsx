import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1A1614",
        }}
      >
        <svg
          width="132"
          height="132"
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
      </div>
    ),
    {
      ...size,
    }
  );
}

