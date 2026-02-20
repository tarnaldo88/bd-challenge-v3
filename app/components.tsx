"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  CollectionCardProduct,
  Money,
  QuickViewProduct,
} from "@/lib/shopify/graphql/query";

type ProductGridProps = {
  products: CollectionCardProduct[];
};

type QuickViewModalProps = {
  product: CollectionCardProduct;
  onClose: () => void;
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
          <article
            key={product.id}
            className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-xl bg-zinc-100">
              {product.featuredImage ? (
                <img
                  src={product.featuredImage.url}
                  alt={product.featuredImage.altText ?? product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-zinc-200" />
              )}
            </div>

            <h2 className="mt-4 text-base font-medium text-zinc-900">
              {product.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              {formatMoney(product.priceRange.minVariantPrice)}
            </p>

            <button
              type="button"
              onClick={(event) =>
                openQuickView(product.handle, event.currentTarget)
              }
              className="mt-4 w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Quick View
            </button>
          </article>
        ))}
      </section>

      {activeProduct ? (
        <QuickViewModal product={activeProduct} onClose={closeQuickView} />
      ) : null}
    </>
  );
}

function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      <button
        type="button"
        aria-label="Close quick view"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-view-title"
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Close
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="aspect-[4/5] bg-zinc-100">
            {product.featuredImage ? (
              <img
                src={product.featuredImage.url}
                alt={product.featuredImage.altText ?? product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-zinc-200" />
            )}
          </div>

          <div className="flex flex-col justify-center p-6 md:p-8">
            <h3 id="quick-view-title" className="text-2xl font-semibold text-zinc-900">
              {product.title}
            </h3>
            <p className="mt-2 text-lg text-zinc-700">
              {formatMoney(product.priceRange.minVariantPrice)}
            </p>
            <p className="mt-4 text-sm text-zinc-600">
              Quick view is open as a centered modal (not a drawer).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function formatMoney(money: Money): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(Number(money.amount));
}