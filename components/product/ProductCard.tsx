import type { CollectionCardProduct, Money } from "@/lib/shopify/graphql/query";

type ProductCardProps = {
  product: CollectionCardProduct;
  onQuickView: (handle: string, triggerElement: HTMLButtonElement) => void;
};

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="aspect-[4/5] overflow-hidden rounded-xl bg-zinc-100">
        {product.featuredImage ? (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? product.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-zinc-200" />
        )}
      </div>

      <h2 className="mt-4 text-base font-medium text-zinc-900">{product.title}</h2>
      <p className="mt-1 text-sm text-zinc-600">
        {formatMoney(product.priceRange.minVariantPrice)}
      </p>

      <button
        type="button"
        onClick={(event) => onQuickView(product.handle, event.currentTarget)}
        className="mt-4 w-full rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
      >
        Quick View
      </button>
    </article>
  );
}

function formatMoney(money: Money): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: money.currencyCode,
  }).format(Number(money.amount));
}
