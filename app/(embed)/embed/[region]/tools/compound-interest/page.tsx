import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CompoundInterestTool } from "@/components/tools/CompoundInterestTool";
import { EmbedResizer } from "@/components/calc/EmbedResizer";

type PageProps = {
  params: Promise<{ region: string }>;
};

export function generateStaticParams() {
  return [{ region: "uk" }, { region: "us" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region } = await params;
  if (region !== "uk" && region !== "us") return {};
  const path = `/${region}/tools/compound-interest/`;
  return {
    title: "Compound Interest Calculator",
    robots: { index: false, follow: true },
    alternates: { canonical: path },
  };
}

export default async function EmbedCompoundInterestPage({ params }: PageProps) {
  const { region } = await params;
  if (region !== "uk" && region !== "us") notFound();

  return (
    <>
      <EmbedResizer />
      <CompoundInterestTool region={region} embed />
    </>
  );
}
