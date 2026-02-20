"use client";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent  } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Money, QuickViewProduct } from "@/lib/shopify/graphql/query";
import { QuickViewSkeleton } from "@/components/quick-view/QuickViewSkeleton";
import type {
  QuickViewApiResponse,
  QuickViewModalProps,
  QuickViewModalStatus,
} from "@/components/quick-view/types";
import {
  getInitialSelectedOptions,
  isOptionValueEnabled as isOptionValueEnabledForProduct,
  resolveVariantFromSelectedOptions,
  type SelectedOptions,
} from "@/components/quick-view/variantLogic";

type AddToBagState = "idle" | "loading" | "success";

const ADD_DELAY_MS = 1000;
const SUCCESS_DISPLAY_MS = 1200;

export function QuickViewModal({
  handle,
  fallbackProduct,
  prefetchedProduct,
  imageLayoutId,
  onClose,
}: QuickViewModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const isMountedRef = useRef(true);
  const titleId = useId();
  const descriptionId = useId();
  const activeRequestRef = useRef(0);
  const shouldReduceMotion = useReducedMotion();
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const [status, setStatus] = useState<QuickViewModalStatus>(
    prefetchedProduct ? "ready" : "loading",
  );
  const [product, setProduct] = useState<QuickViewProduct | null>(
    prefetchedProduct ?? null,
  );
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(
    prefetchedProduct ? getInitialSelectedOptions(prefetchedProduct) : {},
  );
  const [addToBagState, setAddToBagState] = useState<AddToBagState>("idle");

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
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
        return;
      }

      if (event.key !== "Tab") return;
      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusable = dialog.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (!active || active === first || !dialog.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (!active || active === last || !dialog.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(() => {
  const controller = new AbortController();
  const requestId = ++activeRequestRef.current;

  const hasExistingProduct = product !== null;

  if (prefetchedProduct && prefetchedProduct.handle === handle) {
    setProduct(prefetchedProduct);
    setSelectedOptions(getInitialSelectedOptions(prefetchedProduct));
    setStatus("ready");
    setAddToBagState("idle");
    setIsSwitchLoading(false);
    return () => controller.abort();
  }

  if (!hasExistingProduct) {
    setStatus("loading");
  } else {
    setIsSwitchLoading(true);
  }

  const loadProduct = async () => {
    try {
      const response = await fetch(
        `/api/shopify/product?handle=${encodeURIComponent(handle)}`,
        { signal: controller.signal, cache: "no-store" },
      );

      if (!response.ok) throw new Error("Failed to fetch product");

      const json = (await response.json()) as QuickViewApiResponse;
      if (controller.signal.aborted || requestId !== activeRequestRef.current) return;

      setProduct(json.product);
      setSelectedOptions(getInitialSelectedOptions(json.product));
      setStatus("ready");
      setAddToBagState("idle");
      setIsSwitchLoading(false);
    } catch {
      if (controller.signal.aborted || requestId !== activeRequestRef.current) return;

      if (!hasExistingProduct) {
        setStatus("error");
      }
      setIsSwitchLoading(false);
    }
  };

  void loadProduct();
    return () => controller.abort();
  }, [handle, prefetchedProduct]);


  const firstAvailableVariant = useMemo(() => {
    if (!product) return null;
    return (
      product.variants.nodes.find((variant) => variant.availableForSale) ??
      product.variants.nodes[0] ??
      null
    );
  }, [product]);

  const resolvedVariant = useMemo(() => {
    if (!product) return null;
    return resolveVariantFromSelectedOptions(product, selectedOptions);
  }, [product, selectedOptions]);

  const displayedVariant = resolvedVariant ?? firstAvailableVariant;
  const displayedPrice =
    displayedVariant?.price ?? fallbackProduct.priceRange.minVariantPrice;
  const displayedImage =
    displayedVariant?.image ?? product?.featuredImage ?? fallbackProduct.featuredImage;

  const displayedCompareAtPrice = displayedVariant?.compareAtPrice ?? null;

  const thumbnails = useMemo(() => {
    if (!product) return [];

    const map = new Map<
      string,
      { key: string; imageUrl: string; alt: string; selectedOptions: SelectedOptions }
    >();

    for (const variant of product.variants.nodes) {
      if (!variant.image) continue;
      const key = variant.image.url;
      if (map.has(key)) continue;

      const optionMap = variant.selectedOptions.reduce<SelectedOptions>((acc, option) => {
        acc[option.name] = option.value;
        return acc;
      }, {});

      map.set(key, {
        key,
        imageUrl: variant.image.url,
        alt: variant.image.altText ?? variant.title,
        selectedOptions: optionMap,
      });
    }

    return Array.from(map.values());
  }, [product]);

  const activeImageKey = displayedImage?.url ?? "fallback-image";

  const handleThumbnailSelect = (next: SelectedOptions) => {
    setSelectedOptions((prev) => ({ ...prev, ...next }));
  };


  const canAddToBag =
    Boolean(resolvedVariant?.availableForSale) && addToBagState === "idle";

  const isOptionValueEnabled = (optionName: string, value: string): boolean => {
    if (!product) return false;
    return isOptionValueEnabledForProduct(
      product,
      selectedOptions,
      optionName,
      value,
    );
  };

  const handleOptionArrowNavigation = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) => {
    if (
      event.key !== "ArrowRight" &&
      event.key !== "ArrowDown" &&
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowUp"
    ) {
      return;
    }

    const group = event.currentTarget.closest("[data-option-values]");
    if (!group) return;

    const enabledButtons = Array.from(
      group.querySelectorAll<HTMLButtonElement>('button[data-option-button="true"]:not(:disabled)'),
    );

    if (enabledButtons.length === 0) return;

    const currentIndex = enabledButtons.indexOf(event.currentTarget);
    if (currentIndex === -1) return;

    event.preventDefault();

    const moveForward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const nextIndex = moveForward
      ? (currentIndex + 1) % enabledButtons.length
      : (currentIndex - 1 + enabledButtons.length) % enabledButtons.length;

    enabledButtons[nextIndex]?.focus();
  };


  const handleAddToBag = async () => {
    if (!resolvedVariant?.availableForSale || addToBagState !== "idle") return;

    setAddToBagState("loading");
    await delay(ADD_DELAY_MS);
    if (!isMountedRef.current) return;

    setAddToBagState("success");
    await delay(SUCCESS_DISPLAY_MS);
    if (!isMountedRef.current) return;

    setAddToBagState("idle");
  };

  const ctaLabel =
    addToBagState === "idle"
      ? "Add to bag"
      : addToBagState === "loading"
        ? "Adding..."
        : "Added ✓";

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.button
        type="button"
        aria-label="Close quick view"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
        animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
        exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-30 rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          Close
        </button>

        {status === "loading" ? (
          <QuickViewSkeleton />
        ) : status === "error" ? (
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="aspect-[4/5] bg-zinc-100" />
            <div className="flex flex-col justify-center p-6 md:p-8">
              <h3 id={titleId} className="text-2xl font-semibold text-zinc-900">
                Could not load product
              </h3>
              <p id={descriptionId} className="mt-3 text-sm text-zinc-600">
                Please close and try again.
              </p>
            </div>
          </div>
        ) : product ? (
          <>
            <div className="relative grid grid-cols-1 md:grid-cols-2">
              <div className="space-y-3">
                <motion.div
                  layoutId={imageLayoutId}
                  className="aspect-[4/5] overflow-hidden bg-zinc-100"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {displayedImage ? (
                      <motion.img
                        key={activeImageKey}
                        src={displayedImage.url}
                        alt={displayedImage.altText ?? product.title}
                        className="h-full w-full object-cover"
                        initial={shouldReduceMotion ? false : { opacity: 0.25 }}
                        animate={{ opacity: 1 }}
                        exit={shouldReduceMotion ? undefined : { opacity: 0.25 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                      />
                    ) : (
                      <motion.div
                        key="no-image"
                        className="h-full w-full bg-zinc-200"
                        initial={shouldReduceMotion ? false : { opacity: 0.25 }}
                        animate={{ opacity: 1 }}
                        exit={shouldReduceMotion ? undefined : { opacity: 0.25 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                      />
                    )}
                  </AnimatePresence>
                </motion.div>

                {thumbnails.length > 1 ? (
                  <div className="flex gap-2 overflow-x-auto px-1 pb-1">
                    {thumbnails.map((thumb) => {
                      const selected = thumb.imageUrl === activeImageKey;
                      return (
                        <button
                          key={thumb.key}
                          type="button"
                          onClick={() => handleThumbnailSelect(thumb.selectedOptions)}
                          className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md border border-zinc-300"
                          aria-pressed={selected}
                          aria-label={`Show image ${thumb.alt}`}
                        >
                          {selected ? (
                            <motion.span
                              layoutId="active-thumbnail-ring"
                              className="absolute inset-0 z-10 rounded-md border-2 border-zinc-900"
                              transition={{ duration: shouldReduceMotion ? 0 : 0.18 }}
                            />
                          ) : null}
                          <img
                            src={thumb.imageUrl}
                            alt={thumb.alt}
                            className="h-full w-full object-cover"
                          />
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              <div className="flex flex-col gap-6 p-6 pb-28 md:p-8 md:pb-8">
                <header>
                  <h3 id={titleId} className="text-2xl font-semibold text-zinc-900">
                    {product.title}
                  </h3>

                  <motion.div layout className="mt-2 flex items-center gap-2">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.p
                        key={`price-${displayedPrice.currencyCode}-${displayedPrice.amount}`}
                        layout
                        className="text-lg text-zinc-700"
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
                      >
                        {formatMoney(displayedPrice)}
                      </motion.p>
                    </AnimatePresence>

                    <AnimatePresence mode="popLayout" initial={false}>
                      {displayedCompareAtPrice ? (
                        <motion.p
                          key={`compare-${displayedCompareAtPrice.currencyCode}-${displayedCompareAtPrice.amount}`}
                          layout
                          className="text-sm text-zinc-500 line-through"
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={shouldReduceMotion ? undefined : { opacity: 0, y: -4 }}
                          transition={{ duration: shouldReduceMotion ? 0 : 0.16 }}
                        >
                          {formatMoney(displayedCompareAtPrice)}
                        </motion.p>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>

                  {product.description ? (
                    <p id={descriptionId} className="mt-4 text-sm leading-relaxed text-zinc-600">
                      {product.description}
                    </p>
                  ) : (
                    <p id={descriptionId} className="sr-only">
                      Quick view product modal
                    </p>
                  )}
                </header>

                <div className="space-y-4">
                  {product.options.map((option) => (
                    <fieldset key={option.id} className="space-y-2">
                      <legend className="text-sm font-medium text-zinc-900">{option.name}</legend>
                      <div data-option-values className="flex flex-wrap gap-2">
                        {option.values.map((value) => {
                          const selected = selectedOptions[option.name] === value;
                          const enabled = isOptionValueEnabled(option.name, value);

                          return (
                            <button
                              key={value}
                              type="button"
                              data-option-button="true"
                              aria-pressed={selected}
                              disabled={!enabled}
                              onKeyDown={handleOptionArrowNavigation}
                              onClick={() =>
                                setSelectedOptions((previous) => ({
                                  ...previous,
                                  [option.name]: value,
                                }))
                              }
                              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                                selected
                                  ? "border-zinc-900 bg-zinc-900 text-white"
                                  : "border-zinc-300 bg-white text-zinc-800"
                              } ${
                                enabled
                                  ? "hover:border-zinc-500"
                                  : "cursor-not-allowed opacity-40"
                              }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddToBag}
                  disabled={!canAddToBag}
                  className={`mt-auto hidden h-12 rounded-xl text-sm font-semibold transition md:block ${
                    canAddToBag
                      ? "bg-zinc-900 text-white hover:bg-zinc-800"
                      : "cursor-not-allowed bg-zinc-200 text-zinc-500"
                  }`}
                >
                  {ctaLabel}
                </button>
              </div>

              {isSwitchLoading ? (
                <div className="pointer-events-none absolute inset-0 z-20 bg-white/80 backdrop-blur-[1px]">
                  <QuickViewSkeleton />
                </div>
              ) : null}
            </div>

            <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-zinc-200 bg-white/95 p-4 backdrop-blur md:hidden">
              <button
                type="button"
                onClick={handleAddToBag}
                disabled={!canAddToBag}
                className={`h-12 w-full rounded-xl text-sm font-semibold transition ${
                  canAddToBag
                    ? "bg-zinc-900 text-white hover:bg-zinc-800"
                    : "cursor-not-allowed bg-zinc-200 text-zinc-500"
                }`}
              >
                {ctaLabel}
              </button>
            </div>
          </>
        ) : null}
      </motion.section>
    </motion.div>
  );
}

function formatMoney(money: Money): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(Number(money.amount));
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
