import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="16" cy="16" r="15" fill="#ED6C30" />
          <path
            d="M 16 5.5 C 10.5 10.8 10.5 21.2 16 26.5 C 21.5 21.2 21.5 10.8 16 5.5 Z"
            fill="#FFFAF5"
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

