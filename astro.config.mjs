// @ts-check
import { defineConfig, passthroughImageService } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import compress from "astro-compress";
import remarkImageOptimization from "./src/lib/remark-image-optimization";

// https://astro.build/config
export default defineConfig({
  adapter: cloudflare(),
  image: {
    service: passthroughImageService(),
  },
  integrations: [
    mdx(),
    compress({
      CSS: true,
      HTML: false,
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),
  ],
  markdown: {
    remarkPlugins: [remarkImageOptimization],
  },
});
