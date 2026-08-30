import { ImageResponse } from "next/og";
import { siteConfig } from "@/constants/site";

export const alt = siteConfig.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Generated at build time by next/og rather than shipped as a static PNG.
 *
 * The previous metadata pointed at `/og-image.png`, which never existed —
 * every social share rendered a broken preview. Generating it means the
 * asset can't drift out of sync with the brand, and there's no binary in
 * the repo to keep updated.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #F2994A 0%, #E8823A 45%, #3B82F6 140%)",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34, opacity: 0.92 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              background: "rgba(255,255,255,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
            }}
          >
            🐾
          </div>
          <span style={{ fontWeight: 600 }}>{siteConfig.shortName}</span>
        </div>

        <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.1, marginTop: 40 }}>
          Your pet&apos;s whole world, delivered with care.
        </div>

        <div style={{ display: "flex", fontSize: 30, marginTop: 28, opacity: 0.9 }}>
          Trusted products · Expert vet care · Fast delivery
        </div>
      </div>
    ),
    size,
  );
}
