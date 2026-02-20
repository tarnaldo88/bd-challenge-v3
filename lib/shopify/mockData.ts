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
      altText: "Black mock tee",
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
  {
    id: "mock-product-2",
    handle: "mock-hoodie",
    title: "Bryt Mock Hoodie",
    featuredImage: {
      url: "https://picsum.photos/id/1005/900/1100",
      altText: "Charcoal hoodie",
      width: 900,
      height: 1100,
    },
    priceRange: {
      minVariantPrice: {
        amount: "84.00",
        currencyCode: "USD",
      },
    },
  },
  {
    id: "mock-product-3",
    handle: "mock-cap",
    title: "Bryt Mock Cap",
    featuredImage: {
      url: "https://picsum.photos/id/64/900/1100",
      altText: "Structured cap",
      width: 900,
      height: 1100,
    },
    priceRange: {
      minVariantPrice: {
        amount: "32.00",
        currencyCode: "USD",
      },
    },
  },
  {
    id: "mock-product-4",
    handle: "mock-tote",
    title: "Bryt Mock Tote",
    featuredImage: {
      url: "https://picsum.photos/id/1062/900/1100",
      altText: "Canvas tote",
      width: 900,
      height: 1100,
    },
    priceRange: {
      minVariantPrice: {
        amount: "38.00",
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
    description: "Soft heavyweight tee with a relaxed fit.",
    featuredImage: {
      url: "https://picsum.photos/id/26/900/1100",
      altText: "Mock tee default image",
      width: 900,
      height: 1100,
    },
    options: [
      { id: "tee-color", name: "Color", values: ["Black", "Sand"] },
      { id: "tee-size", name: "Size", values: ["S", "M", "L"] },
    ],
    variants: {
      nodes: [
        {
          id: "tee-v1",
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
          id: "tee-v2",
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
          id: "tee-v3",
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
          id: "tee-v4",
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
          id: "tee-v5",
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
          id: "tee-v6",
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

  "mock-hoodie": {
    id: "mock-product-2",
    handle: "mock-hoodie",
    title: "Bryt Mock Hoodie",
    description: "Midweight fleece hoodie with brushed interior.",
    featuredImage: {
      url: "https://picsum.photos/id/1005/900/1100",
      altText: "Hoodie default image",
      width: 900,
      height: 1100,
    },
    options: [
      { id: "hoodie-color", name: "Color", values: ["Charcoal", "Bone"] },
      { id: "hoodie-size", name: "Size", values: ["M", "L", "XL"] },
    ],
    variants: {
      nodes: [
        {
          id: "hoodie-v1",
          title: "Charcoal / M",
          availableForSale: true,
          selectedOptions: [
            { name: "Color", value: "Charcoal" },
            { name: "Size", value: "M" },
          ],
          image: {
            url: "https://picsum.photos/id/1005/900/1100",
            altText: "Charcoal hoodie",
            width: 900,
            height: 1100,
          },
          price: { amount: "84.00", currencyCode: "USD" },
          compareAtPrice: { amount: "98.00", currencyCode: "USD" },
        },
        {
          id: "hoodie-v2",
          title: "Charcoal / L",
          availableForSale: true,
          selectedOptions: [
            { name: "Color", value: "Charcoal" },
            { name: "Size", value: "L" },
          ],
          image: {
            url: "https://picsum.photos/id/1005/900/1100",
            altText: "Charcoal hoodie",
            width: 900,
            height: 1100,
          },
          price: { amount: "84.00", currencyCode: "USD" },
          compareAtPrice: null,
        },
        {
          id: "hoodie-v3",
          title: "Charcoal / XL",
          availableForSale: false,
          selectedOptions: [
            { name: "Color", value: "Charcoal" },
            { name: "Size", value: "XL" },
          ],
          image: {
            url: "https://picsum.photos/id/1005/900/1100",
            altText: "Charcoal hoodie",
            width: 900,
            height: 1100,
          },
          price: { amount: "84.00", currencyCode: "USD" },
          compareAtPrice: null,
        },
        {
          id: "hoodie-v4",
          title: "Bone / M",
          availableForSale: true,
          selectedOptions: [
            { name: "Color", value: "Bone" },
            { name: "Size", value: "M" },
          ],
          image: {
            url: "https://picsum.photos/id/1011/900/1100",
            altText: "Bone hoodie",
            width: 900,
            height: 1100,
          },
          price: { amount: "88.00", currencyCode: "USD" },
          compareAtPrice: null,
        },
        {
          id: "hoodie-v5",
          title: "Bone / L",
          availableForSale: true,
          selectedOptions: [
            { name: "Color", value: "Bone" },
            { name: "Size", value: "L" },
          ],
          image: {
            url: "https://picsum.photos/id/1011/900/1100",
            altText: "Bone hoodie",
            width: 900,
            height: 1100,
          },
          price: { amount: "88.00", currencyCode: "USD" },
          compareAtPrice: { amount: "104.00", currencyCode: "USD" },
        },
        {
          id: "hoodie-v6",
          title: "Bone / XL",
          availableForSale: false,
          selectedOptions: [
            { name: "Color", value: "Bone" },
            { name: "Size", value: "XL" },
          ],
          image: {
            url: "https://picsum.photos/id/1011/900/1100",
            altText: "Bone hoodie",
            width: 900,
            height: 1100,
          },
          price: { amount: "88.00", currencyCode: "USD" },
          compareAtPrice: null,
        },
      ],
    },
  },

  "mock-cap": {
    id: "mock-product-3",
    handle: "mock-cap",
    title: "Bryt Mock Cap",
    description: "Structured cap with adjustable back strap.",
    featuredImage: {
      url: "https://picsum.photos/id/64/900/1100",
      altText: "Cap default image",
      width: 900,
      height: 1100,
    },
    options: [
      { id: "cap-color", name: "Color", values: ["Navy", "Olive", "Stone"] },
      { id: "cap-size", name: "Size", values: ["OS"] },
    ],
    variants: {
      nodes: [
        {
          id: "cap-v1",
          title: "Navy / OS",
          availableForSale: true,
          selectedOptions: [
            { name: "Color", value: "Navy" },
            { name: "Size", value: "OS" },
          ],
          image: {
            url: "https://picsum.photos/id/64/900/1100",
            altText: "Navy cap",
            width: 900,
            height: 1100,
          },
          price: { amount: "32.00", currencyCode: "USD" },
          compareAtPrice: null,
        },
        {
          id: "cap-v2",
          title: "Olive / OS",
          availableForSale: true,
          selectedOptions: [
            { name: "Color", value: "Olive" },
            { name: "Size", value: "OS" },
          ],
          image: {
            url: "https://picsum.photos/id/65/900/1100",
            altText: "Olive cap",
            width: 900,
            height: 1100,
          },
          price: { amount: "32.00", currencyCode: "USD" },
          compareAtPrice: { amount: "38.00", currencyCode: "USD" },
        },
        {
          id: "cap-v3",
          title: "Stone / OS",
          availableForSale: false,
          selectedOptions: [
            { name: "Color", value: "Stone" },
            { name: "Size", value: "OS" },
          ],
          image: {
            url: "https://picsum.photos/id/66/900/1100",
            altText: "Stone cap",
            width: 900,
            height: 1100,
          },
          price: { amount: "32.00", currencyCode: "USD" },
          compareAtPrice: null,
        },
      ],
    },
  },

  "mock-tote": {
    id: "mock-product-4",
    handle: "mock-tote",
    title: "Bryt Mock Tote",
    description: "Heavy canvas tote with internal pocket.",
    featuredImage: {
      url: "https://picsum.photos/id/1062/900/1100",
      altText: "Tote default image",
      width: 900,
      height: 1100,
    },
    options: [
      { id: "tote-color", name: "Color", values: ["Natural", "Black"] },
      { id: "tote-size", name: "Size", values: ["Standard", "Large"] },
    ],
    variants: {
      nodes: [
        {
          id: "tote-v1",
          title: "Natural / Standard",
          availableForSale: true,
          selectedOptions: [
            { name: "Color", value: "Natural" },
            { name: "Size", value: "Standard" },
          ],
          image: {
            url: "https://picsum.photos/id/1062/900/1100",
            altText: "Natural tote",
            width: 900,
            height: 1100,
          },
          price: { amount: "38.00", currencyCode: "USD" },
          compareAtPrice: null,
        },
        {
          id: "tote-v2",
          title: "Natural / Large",
          availableForSale: true,
          selectedOptions: [
            { name: "Color", value: "Natural" },
            { name: "Size", value: "Large" },
          ],
          image: {
            url: "https://picsum.photos/id/1062/900/1100",
            altText: "Natural tote large",
            width: 900,
            height: 1100,
          },
          price: { amount: "44.00", currencyCode: "USD" },
          compareAtPrice: { amount: "50.00", currencyCode: "USD" },
        },
        {
          id: "tote-v3",
          title: "Black / Standard",
          availableForSale: false,
          selectedOptions: [
            { name: "Color", value: "Black" },
            { name: "Size", value: "Standard" },
          ],
          image: {
            url: "https://picsum.photos/id/1063/900/1100",
            altText: "Black tote",
            width: 900,
            height: 1100,
          },
          price: { amount: "38.00", currencyCode: "USD" },
          compareAtPrice: null,
        },
        {
          id: "tote-v4",
          title: "Black / Large",
          availableForSale: true,
          selectedOptions: [
            { name: "Color", value: "Black" },
            { name: "Size", value: "Large" },
          ],
          image: {
            url: "https://picsum.photos/id/1063/900/1100",
            altText: "Black tote large",
            width: 900,
            height: 1100,
          },
          price: { amount: "44.00", currencyCode: "USD" },
          compareAtPrice: null,
        },
      ],
    },
  },
};
