"use client";

/**
 * Last-resort boundary for errors thrown in the root layout itself.
 *
 * When this fires, the layout (and therefore the navbar, footer, fonts,
 * providers and global CSS) failed — so this component has to render its
 * own `<html>`/`<body>` and cannot rely on any app styling. Hence the
 * inline styles: they're not a shortcut, they're the only thing
 * guaranteed to work in this state.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#ffffff",
          color: "#1a1a1a",
        }}
      >
        <div style={{ textAlign: "center", padding: 32, maxWidth: 460 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>Something went wrong</h1>
          <p style={{ marginTop: 12, color: "#666", lineHeight: 1.6 }}>
            The application failed to load. Please refresh the page.
          </p>
          {error.digest && (
            <p style={{ marginTop: 8, fontFamily: "monospace", fontSize: 13, color: "#999" }}>
              Reference: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              padding: "10px 20px",
              fontSize: 15,
              fontWeight: 500,
              color: "#ffffff",
              background: "#e8823a",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
