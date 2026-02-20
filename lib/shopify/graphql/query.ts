export const getShop = `#graphql
  query getShop {
    shop {
      name
      description
    }
  }
` as const;

export const getCollectionProductsQuery = `#graphql
  query getCollectionProducts($handle: String!) {
    collection(handle: $handle) {
      products(first: 12) {
        nodes {
          id
          handle
          title
          featuredImage {
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
` as const;

export const getQuickViewProductQuery = `#graphql
  query getQuickViewProduct($handle: String!) {
    productByHandle(handle: $handle) {
      id
      handle
      title
      description
      featuredImage {
        url
        altText
        width
        height
      }
      options {
        id
        name
        values
      }
      variants(first: 100) {
        nodes {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          image {
            url
            altText
            width
            height
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
` as const;

export type Money = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type CollectionCardProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage: ShopifyImage | null;
  priceRange: {
    minVariantPrice: Money;
  };
};

export type QuickViewProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type QuickViewVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image: ShopifyImage | null;
  price: Money;
  compareAtPrice: Money | null;
};

export type QuickViewProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: ShopifyImage | null;
  options: QuickViewProductOption[];
  variants: {
    nodes: QuickViewVariant[];
  };
};

export type GetCollectionProductsResponse = {
  collection: {
    products: {
      nodes: CollectionCardProduct[];
    };
  } | null;
};

export type GetQuickViewProductResponse = {
  productByHandle: QuickViewProduct | null;
};