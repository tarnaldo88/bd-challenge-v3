import { describe, expect, it } from "vitest";
import { MOCK_QUICK_VIEW_PRODUCTS } from "@/lib/shopify/mockData";
import {
  getInitialSelectedOptions,
  isOptionValueEnabled,
  resolveVariantFromSelectedOptions,
} from "@/components/quick-view/variantLogic";

describe("variant logic", () => {
  const product = MOCK_QUICK_VIEW_PRODUCTS["mock-tee"];

  it("returns initial selected options from first available variant", () => {
    const selected = getInitialSelectedOptions(product);
    expect(selected).toEqual({
      Color: "Black",
      Size: "S",
    });
  });

  it("resolves variant from a full selectedOptions map", () => {
    const variant = resolveVariantFromSelectedOptions(product, {
      Color: "Sand",
      Size: "L",
    });

    expect(variant?.id).toBe("tee-v6");
    expect(variant?.availableForSale).toBe(true);
    expect(variant?.price.amount).toBe("52.00");
  });

  it("disables invalid values for the current partial selection", () => {
    const partial = { Color: "Sand" };

    expect(isOptionValueEnabled(product, partial, "Size", "M")).toBe(false);
    expect(isOptionValueEnabled(product, partial, "Size", "L")).toBe(true);
  });

  it("returns null when selectedOptions is incomplete", () => {
    const variant = resolveVariantFromSelectedOptions(product, {
      Color: "Black",
    });

    expect(variant).toBeNull();
  });

  it("returns null when selectedOptions do not match any variant", () => {
    const variant = resolveVariantFromSelectedOptions(product, {
      Color: "NotARealColor",
      Size: "M",
    });

    expect(variant).toBeNull();
  })
});
