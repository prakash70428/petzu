import { ExternalLink } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { Product } from "../types";
import { amazonUrl } from "../utils";

export interface BuyOnAmazonButtonProps extends Omit<ButtonProps, "asChild" | "children"> {
  product: Product;
}

/**
 * PetZu doesn't sell or ship anything itself (client feedback: "we will be
 * linking product pages to Amazon, this is just a support site"), so every
 * product's only buy action opens Amazon in a new tab.
 */
export function BuyOnAmazonButton({ product, className, ...props }: BuyOnAmazonButtonProps) {
  return (
    <Button asChild className={className} {...props}>
      <a href={amazonUrl(product)} target="_blank" rel="noopener noreferrer sponsored">
        Buy on Amazon
        <ExternalLink className="size-3.5" aria-hidden />
      </a>
    </Button>
  );
}
