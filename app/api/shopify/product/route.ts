import {NextRequest, NextResponse} from "next/server";
import {client} from "@/lib/shopify/serverClient";
import {
  getQuickViewProductQuery,
  type GetQuickViewProductResponse,
} from "@/lib/shopify/graphql/query";
import { error } from "console";

export const revalidate = 0;

export async function GET(request: NextRequest) {
    const handle = request.nextUrl.searchParams.get("handle");

    if(!handle) {
        return NextResponse.json({error: "Missing product handle."}, {status: 400});
    }

    const response = await client.request(getQuickViewProductQuery, {
        variables: { handle },
    });

    const data = response.data as GetQuickViewProductResponse | undefined;
    const product = data?.productByHandle ?? null;

    if (!product) {
        return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product });
}