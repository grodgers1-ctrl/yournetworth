import { NextRequest, NextResponse } from "next/server";
import { getAffiliate } from "@/lib/affiliate/registry";

export function generateStaticParams() {
  return [{ id: "wise" }];
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const affiliate = getAffiliate(id);
  if (!affiliate) {
    return NextResponse.redirect(new URL("/", request.url), 307);
  }
  return NextResponse.redirect(affiliate.url, 307);
}
