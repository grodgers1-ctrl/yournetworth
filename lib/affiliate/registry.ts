export type AffiliatePartner = {
  id: string;
  name: string;
  url: string;
  disclosure: string;
  tools: string[];
  position: "sidebar" | "footer" | "inline";
};

export const affiliates: AffiliatePartner[] = [
  {
    id: "wise",
    name: "Wise",
    url: "https://wise.com/",
    disclosure: "This is an affiliate link. We receive a small commission if you sign up, at no extra cost to you.",
    tools: ["multi-currency-budget"],
    position: "inline",
  },
];

export function getAffiliate(id: string): AffiliatePartner | undefined {
  return affiliates.find((a) => a.id === id);
}

export function getAffiliatesForTool(toolSlug: string, position?: AffiliatePartner["position"]): AffiliatePartner[] {
  return affiliates.filter((a) => a.tools.includes(toolSlug) && (!position || a.position === position));
}
