import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmergencyFundTool } from "@/components/tools/EmergencyFundTool";
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
  const path = `/${region}/tools/emergency-fund/`;
  return {
    title: "Emergency Fund Calculator",
    robots: { index: false, follow: true },
    alternates: { canonical: path },
  };
}

export default async function EmbedEmergencyFundPage({ params }: PageProps) {
  const { region } = await params;
  if (region !== "uk" && region !== "us") notFound();

  return (
    <>
      <EmbedResizer />
      <EmergencyFundTool region={region} embed />
    </>
  );
}
