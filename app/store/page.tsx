import { client } from "@/lib/shopify/serverClient";
import {
  getCollectionProductsQuery,
  type GetCollectionProductsResponse,
} from "@/lib/shopify/graphql/query";
import { ProductGrid } from "../components";

const COLLECTION_HANDLE = "a collection should go here";

export default async function Home() {
  const response = await client.request(getCollectionProductsQuery, {
    variables: { handle: COLLECTION_HANDLE },
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
        <p className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-600">
          No products found. Check your collection handle in `app/store/page.tsx`.
        </p>
      )}
    </main>
  );
}
