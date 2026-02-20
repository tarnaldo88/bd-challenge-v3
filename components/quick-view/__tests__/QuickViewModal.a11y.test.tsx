import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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
});
