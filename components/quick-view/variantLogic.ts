import type { QuickViewProduct, QuickViewVariant } from "@/lib/shopify/graphql/query";

export type SelectedOptions = Record<string, string>;

export function getInitialSelectedOptions(
  product: QuickViewProduct,
): SelectedOptions {
  const variant =
    product.variants.nodes.find((item) => item.availableForSale) ??
    product.variants.nodes[0];

  if (!variant) return {};

  return variant.selectedOptions.reduce<SelectedOptions>((acc, option) => {
    acc[option.name] = option.value;
    return acc;
  }, {});
}

export function resolveVariantFromSelectedOptions(
  product: QuickViewProduct,
  selectedOptions: SelectedOptions,
): QuickViewVariant | null {
  const allOptionsSelected = product.options.every(
    (option) => Boolean(selectedOptions[option.name]),
  );

  if (!allOptionsSelected) return null;

  return (
    product.variants.nodes.find((variant) =>
      variant.selectedOptions.every(
        (selected) => selectedOptions[selected.name] === selected.value,
      ),
    ) ?? null
  );
}

export function isOptionValueEnabled(
  product: QuickViewProduct,
  selectedOptions: SelectedOptions,
  optionName: string,
  value: string,
): boolean {
  return product.variants.nodes.some((variant) => {
    if (!variant.availableForSale) return false;

    return variant.selectedOptions.every((selected) => {
      if (selected.name === optionName) return selected.value === value;
      const pickedValue = selectedOptions[selected.name];
      return pickedValue ? pickedValue === selected.value : true;
    });
  });
}
