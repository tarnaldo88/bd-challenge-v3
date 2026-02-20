"use client";

import { useMemo, useRef, useState } from "react";
import type { CollectionCardProduct } from "@/lib/shopify/graphql/query";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/quick-view/QuickViewModal";

type ProductGridProps = {
  products: CollectionCardProduct[];
};

export function ProductGrid({ products }: ProductGridProps) {
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const activeProduct = useMemo(
    () => products.find((product) => product.handle === activeHandle) ?? null,
    [products, activeHandle],
  );

  const openQuickView = (
    productHandle: string,
    triggerElement: HTMLButtonElement,
  ) => {
    triggerRef.current = triggerElement;
    setActiveHandle(productHandle);
  };

  const closeQuickView = () => {
    setActiveHandle(null);

    const previousTrigger = triggerRef.current;
    triggerRef.current = null;

    if (previousTrigger) {
      requestAnimationFrame(() => previousTrigger.focus());
    }
  };

  return (
    <>
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onQuickView={openQuickView}
          />
        ))}
      </section>

      {activeProduct ? (
        <QuickViewModal
          handle={activeProduct.handle}
          fallbackProduct={activeProduct}
          onClose={closeQuickView}
        />
      ) : null}
    </>
  );
}
