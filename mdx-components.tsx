import type { MDXComponents } from "mdx/types";
import { CalloutDark } from "@/components/mdx/CalloutDark";
import { FAQ } from "@/components/mdx/FAQ";
import { Related } from "@/components/mdx/Related";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    CalloutDark,
    FAQ,
    Related,
    ...components,
  };
}
