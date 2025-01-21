// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import remarkImageOptimization from "./src/lib/remark-image-optimization";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkImageOptimization],
  },
});
