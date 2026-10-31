"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "40px",
          textAlign: "center",
          backgroundColor: "#F7F0E9",
          color: "#1A1614",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2 style={{ fontSize: "28px", margin: "0 0 12px 0" }}>Something went wrong</h2>
        <p style={{ color: "#6B5F57", maxWidth: "480px", marginBottom: "24px" }}>
          {error?.message || "An unexpected error occurred."}
        </p>
        <button
          onClick={() => reset()}
          style={{
            padding: "10px 24px",
            backgroundColor: "#ED6C30",
            color: "#FFF",
            border: "none",
            borderRadius: "9999px",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "15px",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}

