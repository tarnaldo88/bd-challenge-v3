"use client";

import { useEffect, useRef, useState } from "react";
import type { Money, QuickViewProduct } from "@/lib/shopify/graphql/query";
import { QuickViewSkeleton } from "@/components/quick-view/QuickViewSkeleton";
import type {
  QuickViewApiResponse,
  QuickViewModalProps,
  QuickViewModalStatus,
} from "@/components/quick-view/types";

export function QuickViewModal({
  handle,
  fallbackProduct,
  onClose,
}: QuickViewModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<QuickViewModalStatus>("loading");
  const [product, setProduct] = useState<QuickViewProduct | null>(null);

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

  useEffect(() => {
    const controller = new AbortController();

    const loadProduct = async () => {
      try {
        setStatus("loading");

        const response = await fetch(
          `/api/shopify/product?handle=${encodeURIComponent(handle)}`,
          {
            signal: controller.signal,
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }

        const json = (await response.json()) as QuickViewApiResponse;
        setProduct(json.product);
        setStatus("ready");
      } catch {
        if (!controller.signal.aborted) {
          setStatus("error");
        }
      }
    };

    void loadProduct();

    return () => controller.abort();
  }, [handle]);

  const primaryVariant = product?.variants.nodes[0] ?? null;
  const price = primaryVariant?.price ?? fallbackProduct.priceRange.minVariantPrice;
  const image = product?.featuredImage ?? fallbackProduct.featuredImage;

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

        {status === "loading" ? (
          <QuickViewSkeleton />
        ) : status === "error" ? (
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="aspect-[4/5] bg-zinc-100" />
            <div className="flex flex-col justify-center p-6 md:p-8">
              <h3 id="quick-view-title" className="text-2xl font-semibold text-zinc-900">
                Could not load product
              </h3>
              <p className="mt-3 text-sm text-zinc-600">
                Please close and try again.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="aspect-[4/5] bg-zinc-100">
              {image ? (
                <img
                  src={image.url}
                  alt={image.altText ?? (product?.title ?? fallbackProduct.title)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-zinc-200" />
              )}
            </div>

            <div className="flex flex-col justify-center p-6 md:p-8">
              <h3 id="quick-view-title" className="text-2xl font-semibold text-zinc-900">
                {product?.title ?? fallbackProduct.title}
              </h3>

              <p className="mt-2 text-lg text-zinc-700">{formatMoney(price)}</p>

              {product?.description ? (
                <p className="mt-4 text-sm leading-relaxed text-zinc-600">
                  {product.description}
                </p>
              ) : null}
            </div>
          </div>
        )}
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
