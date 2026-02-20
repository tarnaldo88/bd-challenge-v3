import {
  getCollectionProductsQuery,
  type GetCollectionProductsResponse,
} from "@/lib/shopify/graphql/query";
import { ProductGrid } from "@/components/product/ProductGrid";
import { client } from "@/lib/shopify/serverClient";

export default async function Home() {
  const collectionHandle = process.env.NEXT_PUBLIC_SHOPIFY_COLLECTION_HANDLE;

  if (!collectionHandle || collectionHandle === "REPLACE_WITH_COLLECTION_HANDLE") {
    return (
      <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-6">
        <header className="mb-8 space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            Bryt Designs Challenge
          </p>
          <h1 className="text-3xl font-semibold text-zinc-900 md:text-4xl">
            Shopify Quick View Modal
          </h1>
        </header>
        <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
          Missing `NEXT_PUBLIC_SHOPIFY_COLLECTION_HANDLE` in your environment.
        </p>
      </main>
    );
  }

  const response = await client.request(getCollectionProductsQuery, {
    variables: { handle: collectionHandle },
  });

  const data = response.data as GetCollectionProductsResponse | undefined;
  const products = data?.collection?.products.nodes ?? [];

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-10 md:px-6">
      <header className="mb-8 space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          Bryt Designs Challenge
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900 md:text-4xl">
          Shopify Quick View Modal
        </h1>
      </header>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700">
          No products found for collection handle `{collectionHandle}`.
        </p>
      )}
    </main>
  );
}
