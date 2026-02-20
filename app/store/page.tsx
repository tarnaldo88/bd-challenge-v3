import {
  getCollectionProductsQuery,
  type CollectionCardProduct,
  type GetCollectionProductsResponse,
} from "@/lib/shopify/graphql/query";
import { ProductGrid } from "@/components/product/ProductGrid";
import { MOCK_COLLECTION_PRODUCTS } from "@/lib/shopify/mockData";

const COLLECTION_HANDLE = process.env.NEXT_PUBLIC_SHOPIFY_COLLECTION_HANDLE ?? "";

function hasShopifyConfig() {
  return Boolean(
    process.env.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN &&
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_NAME &&
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION &&
      COLLECTION_HANDLE &&
      COLLECTION_HANDLE !== "REPLACE_WITH_COLLECTION_HANDLE",
  );
}

export default async function Home() {
  let products: CollectionCardProduct[] = MOCK_COLLECTION_PRODUCTS;
  let usingMockData = true;

  if (hasShopifyConfig()) {
    try {
      const { client } = await import("@/lib/shopify/serverClient");
      const response = await client.request(getCollectionProductsQuery, {
        variables: { handle: COLLECTION_HANDLE },
      });

      const data = response.data as GetCollectionProductsResponse | undefined;
      const liveProducts = data?.collection?.products.nodes ?? [];

      if (liveProducts.length > 0) {
        products = liveProducts;
        usingMockData = false;
      }
    } catch {
      usingMockData = true;
    }
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-6">
      <header className="mb-8 space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          Bryt Designs Challenge
        </p>
        <h1 className="text-3xl font-semibold text-white-900 md:text-4xl ">
          Shopify Quick View Modal
        </h1>
      </header>

      {usingMockData ? (
        <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Running in mock mode. Add Shopify env vars + collection handle to use live data.
        </p>
      ) : null}

      <ProductGrid products={products} />
    </main>
  );
}
