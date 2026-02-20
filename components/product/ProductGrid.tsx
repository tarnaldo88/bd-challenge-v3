"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup } from "motion/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type {
  CollectionCardProduct,
  QuickViewProduct,
} from "@/lib/shopify/graphql/query";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickViewModal } from "@/components/quick-view/QuickViewModal";
import type { QuickViewApiResponse } from "@/components/quick-view/types";

type ProductGridProps = {
  products: CollectionCardProduct[];
};

const QUICK_VIEW_PARAM = "quickView";

export function ProductGrid({ products }: ProductGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [prefetchedByHandle, setPrefetchedByHandle] = useState<
    Record<string, QuickViewProduct>
  >({});
  const triggerRef = useRef<HTMLElement | null>(null);
  const inFlightPrefetch = useRef<Set<string>>(new Set());
  const openedWithPushRef = useRef(false);
  const previousActiveHandleRef = useRef<string | null>(null);

  const activeHandle = searchParams.get(QUICK_VIEW_PARAM);

  const activeProduct = useMemo(
    () => products.find((product) => product.handle === activeHandle) ?? null,
    [products, activeHandle],
  );

  const buildUrl = (nextHandle: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextHandle) {
      params.set(QUICK_VIEW_PARAM, nextHandle);
    } else {
      params.delete(QUICK_VIEW_PARAM);
    }

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  useEffect(() => {
    const previous = previousActiveHandleRef.current;

    if (previous && !activeHandle) {
      const previousTrigger = triggerRef.current;
      triggerRef.current = null;
      if (previousTrigger) {
        requestAnimationFrame(() => previousTrigger.focus());
      }
      openedWithPushRef.current = false;
    }

    previousActiveHandleRef.current = activeHandle;
  }, [activeHandle]);

  const prefetchProduct = async (handle: string) => {
    if (prefetchedByHandle[handle]) return;
    if (inFlightPrefetch.current.has(handle)) return;

    inFlightPrefetch.current.add(handle);

    try {
      const response = await fetch(
        `/api/shopify/product?handle=${encodeURIComponent(handle)}`,
        { cache: "no-store" },
      );

      if (!response.ok) return;

      const json = (await response.json()) as QuickViewApiResponse;
      setPrefetchedByHandle((prev) => ({ ...prev, [handle]: json.product }));
    } catch {
      // prefetch should never block UX
    } finally {
      inFlightPrefetch.current.delete(handle);
    }
  };

  const openQuickView = (
    productHandle: string,
    triggerElement: HTMLButtonElement,
  ) => {
    triggerRef.current = triggerElement;
    openedWithPushRef.current = true;
    router.push(buildUrl(productHandle), { scroll: false });
  };

  const closeQuickView = () => {
    if (openedWithPushRef.current) {
      router.back();
      return;
    }

    router.replace(buildUrl(null), { scroll: false });
  };

  return (
    <LayoutGroup id="product-quick-view">
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            imageLayoutId={`product-image-${product.handle}`}
            onPrefetch={prefetchProduct}
            onQuickView={openQuickView}
          />
        ))}
      </section>

      <AnimatePresence>
        {activeProduct ? (
          <QuickViewModal
            handle={activeProduct.handle}
            fallbackProduct={activeProduct}
            prefetchedProduct={prefetchedByHandle[activeProduct.handle] ?? null}
            imageLayoutId={`product-image-${activeProduct.handle}`}
            onClose={closeQuickView}
          />
        ) : null}
      </AnimatePresence>
    </LayoutGroup>
  );
}
