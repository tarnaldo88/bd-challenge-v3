import type {
  CollectionCardProduct,
  QuickViewProduct,
} from "@/lib/shopify/graphql/query";

export const MOCK_COLLECTION_PRODUCTS: CollectionCardProduct[] = [
  {
    id: "mock-product-1",
    handle: "mock-tee",
    title: "Bryt Mock Tee",
    featuredImage: {
      url: "https://picsum.photos/id/26/900/1100",
      altText: "Mock tee in studio lighting",
      width: 900,
      height: 1100,
    },
    priceRange: {
      minVariantPrice: {
        amount: "48.00",
        currencyCode: "USD",
      },
    },
  },
];

export const MOCK_QUICK_VIEW_PRODUCTS: Record<string, QuickViewProduct> = {
  "mock-tee": {
    id: "mock-product-1",
    handle: "mock-tee",
    title: "Bryt Mock Tee",
    description:
      "Local mock data for testing quick view interactions without Shopify credentials.",
    featuredImage: {
      url: "https://picsum.photos/id/26/900/1100",
      altText: "Mock tee default image",
      width: 900,
      height: 1100,
    },
    options: [
      { id: "opt-color", name: "Color", values: ["Black", "Sand"] },
      { id: "opt-size", name: "Size", values: ["S", "M", "L"] },
    ],
    variants: {
      nodes: [
        {
          id: "v1",
          title: "Black / S",
          availableForSale: true,
          selectedOptions: [
            { name: "Color", value: "Black" },
            { name: "Size", value: "S" },
          ],
          image: {
            url: "https://picsum.photos/id/26/900/1100",
            altText: "Black tee",
            width: 900,
            height: 1100,
          },
          price: { amount: "48.00", currencyCode: "USD" },
          compareAtPrice: { amount: "56.00", currencyCode: "USD" },
        },
        {
          id: "v2",
          title: "Black / M",
          availableForSale: true,
          selectedOptions: [
            { name: "Color", value: "Black" },
            { name: "Size", value: "M" },
          ],
          image: {
            url: "https://picsum.photos/id/26/900/1100",
            altText: "Black tee",
            width: 900,
            height: 1100,
          },
          price: { amount: "48.00", currencyCode: "USD" },
          compareAtPrice: null,
        },
        {
          id: "v3",
          title: "Black / L",
          availableForSale: false,
          selectedOptions: [
            { name: "Color", value: "Black" },
            { name: "Size", value: "L" },
          ],
          image: {
            url: "https://picsum.photos/id/26/900/1100",
            altText: "Black tee",
            width: 900,
            height: 1100,
          },
          price: { amount: "48.00", currencyCode: "USD" },
          compareAtPrice: null,
        },
        {
          id: "v4",
          title: "Sand / S",
          availableForSale: true,
          selectedOptions: [
            { name: "Color", value: "Sand" },
            { name: "Size", value: "S" },
          ],
          image: {
            url: "https://picsum.photos/id/30/900/1100",
            altText: "Sand tee",
            width: 900,
            height: 1100,
          },
          price: { amount: "52.00", currencyCode: "USD" },
          compareAtPrice: null,
        },
        {
          id: "v5",
          title: "Sand / M",
          availableForSale: false,
          selectedOptions: [
            { name: "Color", value: "Sand" },
            { name: "Size", value: "M" },
          ],
          image: {
            url: "https://picsum.photos/id/30/900/1100",
            altText: "Sand tee",
            width: 900,
            height: 1100,
          },
          price: { amount: "52.00", currencyCode: "USD" },
          compareAtPrice: null,
        },
        {
          id: "v6",
          title: "Sand / L",
          availableForSale: true,
          selectedOptions: [
            { name: "Color", value: "Sand" },
            { name: "Size", value: "L" },
          ],
          image: {
            url: "https://picsum.photos/id/30/900/1100",
            altText: "Sand tee",
            width: 900,
            height: 1100,
          },
          price: { amount: "52.00", currencyCode: "USD" },
          compareAtPrice: { amount: "60.00", currencyCode: "USD" },
        },
      ],
    },
  },
};
