import { NextRequest, NextResponse } from "next/server";
import {
  getQuickViewProductQuery,
  type GetQuickViewProductResponse,
  type QuickViewProduct,
} from "@/lib/shopify/graphql/query";
import { MOCK_QUICK_VIEW_PRODUCTS } from "@/lib/shopify/mockData";

// export const revalidate = 0;

function hasShopifyConfig() {
  return Boolean(
    process.env.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN &&
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_NAME &&
      process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION,
  );
}

function getMockProduct(handle: string): QuickViewProduct | null {
  return MOCK_QUICK_VIEW_PRODUCTS[handle] ?? MOCK_QUICK_VIEW_PRODUCTS["mock-tee"] ?? null;
}

export async function GET(request: NextRequest) {
  const handle = request.nextUrl.searchParams.get("handle");

  if (!handle) {
    return NextResponse.json({ error: "Missing product handle." }, { status: 400 });
  }

  if (!hasShopifyConfig()) {
    const mockProduct = getMockProduct(handle);
    if (!mockProduct) {
      return NextResponse.json({ error: "Mock product not found." }, { status: 404 });
    }
    return NextResponse.json({ product: mockProduct });
  }

  try {
    const { client } = await import("@/lib/shopify/serverClient");

    const response = await client.request(getQuickViewProductQuery, {
      variables: { handle },
    });

    const data = response.data as GetQuickViewProductResponse | undefined;
    const product = data?.productByHandle ?? null;

    if (!product) {
      const mockProduct = getMockProduct(handle);
      if (mockProduct) {
        return NextResponse.json({ product: mockProduct });
      }
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch {
    const mockProduct = getMockProduct(handle);
    if (!mockProduct) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }
    return NextResponse.json({ product: mockProduct });
  }
}
