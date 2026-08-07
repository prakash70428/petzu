"use client";

import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/utils/cn";
import { blogIcons } from "../constants";
import type { IconKey } from "../types";

export interface GalleryImage {
  caption: string;
  iconKey: IconKey;
}

const tileGradients = [
  "from-primary/25 via-primary/10 to-transparent",
  "from-info/25 via-info/10 to-transparent",
  "from-success/25 via-success/10 to-transparent",
  "from-warning/25 via-warning/10 to-transparent",
];

/**
 * A real lightbox interaction (grid → expand → prev/next), built on
 * gradient+icon placeholder tiles rather than fake photography — honest
 * about having no real photo assets while still demonstrating the actual
 * gallery pattern.
 */
export function ImageGallery({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const activeImage = openIndex !== null ? images[openIndex] : null;
  const ActiveIcon = activeImage ? blogIcons[activeImage.iconKey] : null;

  return (
    <div className="my-8">
      <div className="grid grid-cols-3 gap-3">
        {images.map((image, index) => {
          const Icon = blogIcons[image.iconKey];
          return (
            <button
              key={index}
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`View image: ${image.caption}`}
              className={cn(
                "group relative flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br transition-transform duration-200 ease-premium hover:scale-[1.02]",
                tileGradients[index % tileGradients.length],
              )}
            >
              <Icon className="size-10 text-foreground/60" strokeWidth={1.25} aria-hidden />
              <span className="absolute inset-0 flex items-center justify-center bg-background/0 opacity-0 transition-opacity duration-200 ease-premium group-hover:bg-background/40 group-hover:opacity-100">
                <Expand className="size-5 text-foreground" aria-hidden />
              </span>
            </button>
          );
        })}
      </div>

      <Dialog open={openIndex !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        {activeImage && ActiveIcon && openIndex !== null && (
          <>
            <DialogTitle className="sr-only">{activeImage.caption}</DialogTitle>
            <DialogDescription className="sr-only">
              Image {openIndex + 1} of {images.length}
            </DialogDescription>
            <div
              className={cn(
                "relative flex aspect-video items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br",
                tileGradients[openIndex % tileGradients.length],
              )}
            >
              <ActiveIcon className="size-24 text-foreground/60" strokeWidth={1} aria-hidden />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <button
                type="button"
                aria-label="Previous image"
                onClick={() => setOpenIndex((i) => ((i ?? 0) - 1 + images.length) % images.length)}
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <ChevronLeft className="size-4" />
              </button>
              <p className="flex-1 text-center text-body-sm text-muted-foreground">{activeImage.caption}</p>
              <button
                type="button"
                aria-label="Next image"
                onClick={() => setOpenIndex((i) => ((i ?? 0) + 1) % images.length)}
                className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}
