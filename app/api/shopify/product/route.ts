import { NextRequest, NextResponse } from "next/server";
import {
  getQuickViewProductQuery,
  type GetQuickViewProductResponse,
} from "@/lib/shopify/graphql/query";
import { client } from "@/lib/shopify/serverClient";

export async function GET(request: NextRequest) {
  const handle = request.nextUrl.searchParams.get("handle");

  if (!handle) {
    return NextResponse.json({ error: "Missing product handle." }, { status: 400 });
  }

  try {
    const response = await client.request(getQuickViewProductQuery, {
      variables: { handle },
    });

    const data = response.data as GetQuickViewProductResponse | undefined;
    const product = data?.productByHandle ?? null;

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch product from Shopify." },
      { status: 500 },
    );
  }
}
