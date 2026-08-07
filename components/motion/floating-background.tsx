import { cn } from "@/utils/cn";

export interface FloatingBackgroundProps {
  /** `subtle` for content sections, `vivid` for hero/CTA moments. */
  intensity?: "subtle" | "vivid";
  /** Adds slow drifting colour blobs on top of the mesh gradient. */
  blobs?: boolean;
  className?: string;
}

/**
 * The ambient mesh-gradient + drifting-blob backdrop, extracted from the
 * three places that each hand-rolled their own version (hero, auth shell,
 * newsletter CTA). Pure CSS — `animate-float` is a keyframe token, not a
 * Framer animation — so it costs no JavaScript and is composited on the
 * GPU. `aria-hidden` throughout: this is atmosphere, and a screen reader
 * announcing decorative divs is noise.
 */
export function FloatingBackground({
  intensity = "subtle",
  blobs = true,
  className,
}: FloatingBackgroundProps) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}>
      <div
        className={cn(
          "absolute inset-0 bg-gradient-mesh",
          intensity === "vivid" ? "opacity-70" : "opacity-40",
        )}
      />
      {blobs && (
        <>
          <div
            className={cn(
              "absolute -left-32 top-10 size-96 animate-float rounded-full bg-primary/20 blur-[100px]",
              intensity === "subtle" && "opacity-60",
            )}
          />
          <div
            className={cn(
              "absolute -right-24 bottom-0 size-[28rem] animate-float rounded-full bg-info/15 blur-[110px] [animation-delay:1.5s]",
              intensity === "subtle" && "opacity-60",
            )}
          />
        </>
      )}
    </div>
  );
}
