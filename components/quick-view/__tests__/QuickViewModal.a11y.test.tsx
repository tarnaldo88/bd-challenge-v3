import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { QuickViewModal } from "@/components/quick-view/QuickViewModal";
import {
  MOCK_COLLECTION_PRODUCTS,
  MOCK_QUICK_VIEW_PRODUCTS,
} from "@/lib/shopify/mockData";

describe("QuickViewModal accessibility behavior", () => {
  const fallbackProduct = MOCK_COLLECTION_PRODUCTS[0];
  const prefetchedProduct = MOCK_QUICK_VIEW_PRODUCTS["mock-tee"];

  it("renders with dialog semantics and moves focus into the modal", async () => {
    const onClose = vi.fn();

    render(
      <QuickViewModal
        handle="mock-tee"
        fallbackProduct={fallbackProduct}
        prefetchedProduct={prefetchedProduct}
        imageLayoutId="product-image-mock-tee"
        onClose={onClose}
      />,
    );

    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Close" }),
      ).toHaveFocus();
    });
  });

  it("closes when Escape is pressed", async () => {
    const onClose = vi.fn();

    render(
      <QuickViewModal
        handle="mock-tee"
        fallbackProduct={fallbackProduct}
        prefetchedProduct={prefetchedProduct}
        imageLayoutId="product-image-mock-tee"
        onClose={onClose}
      />,
    );

    fireEvent.keyDown(window, { key: "Escape" });

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it("closes when backdrop is clicked", async () => {
    const onClose = vi.fn();

    render(
      <QuickViewModal
        handle="mock-tee"
        fallbackProduct={fallbackProduct}
        prefetchedProduct={prefetchedProduct}
        imageLayoutId="product-image-mock-tee"
        onClose={onClose}
      />,
    );

    fireEvent.click(screen.getByLabelText("Close quick view"));

    await waitFor(() => {
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  it("supports arrow-key navigation between option value buttons", async () => {
    const onClose = vi.fn();

    render(
      <QuickViewModal
        handle="mock-tee"
        fallbackProduct={fallbackProduct}
        prefetchedProduct={prefetchedProduct}
        imageLayoutId="product-image-mock-tee"
        onClose={onClose}
      />,
    );

    const black = screen.getByRole("button", { name: "Black" });
    const sand = screen.getByRole("button", { name: "Sand" });

    black.focus();
    fireEvent.keyDown(black, { key: "ArrowRight" });

    await waitFor(() => {
      expect(sand).toHaveFocus();
    });
  });

  it("transitions add-to-bag label: idle -> loading -> success -> idle", async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();

    render(
      <QuickViewModal
        handle="mock-tee"
        fallbackProduct={fallbackProduct}
        prefetchedProduct={prefetchedProduct}
        imageLayoutId="product-image-mock-tee"
        onClose={onClose}
      />,
    );

    const cta = screen.getAllByRole("button", { name: "Add to bag" })[0];
    fireEvent.click(cta);

    expect(screen.getAllByRole("button", { name: "Adding..." }).length).toBeGreaterThan(0);

    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getAllByRole("button", { name: "Added ✓" }).length).toBeGreaterThan(0);

    await act(async () => {
      vi.advanceTimersByTime(1200);
    });
    expect(screen.getAllByRole("button", { name: "Add to bag" }).length).toBeGreaterThan(0);

    vi.useRealTimers();
  });
});
