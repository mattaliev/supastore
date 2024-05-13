import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    p: (props) => <p className="text-telegram-text-color" {...props} />,
    ...components,
  };
}
