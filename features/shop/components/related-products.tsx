import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import type { Product } from "../types";
import { ProductCard } from "./product-card";

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <div>
      <h2 className="text-heading-3 font-semibold text-foreground">You might also like</h2>
      <RevealGroup className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
        {products.map((product, index) => (
          <RevealItem key={product.id}>
            <ProductCard product={product} index={index} />
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
