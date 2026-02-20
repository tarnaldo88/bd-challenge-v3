import type {
  CollectionCardProduct,
  QuickViewProduct,
} from "@/lib/shopify/graphql/query";

export type QuickViewModalStatus = "loading" | "ready" | "error";

export type QuickViewModalProps = {
  handle: string;
  fallbackProduct: CollectionCardProduct;
  onClose: () => void;
};

export type QuickViewApiResponse = {
  product: QuickViewProduct;
};
