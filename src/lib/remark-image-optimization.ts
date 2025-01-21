import fs from "node:fs";
import path from "node:path";
import type { Image, Root } from "mdast";
import type { FormatEnum } from "sharp";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";
import { getBlur } from "./blur";
import { isLink, isParagraph } from "./mdast-is";

type RemarkImageOptimizationOptions = {
  imgDir: string;
  size: number;
  format: keyof FormatEnum;
};

const defaultRemarkImageOptimizationOptions: Readonly<RemarkImageOptimizationOptions> =
  {
    imgDir: "./assets/images",
    size: 8,
    format: "webp",
  };

const remarkImageOptimization: Plugin<
  [RemarkImageOptimizationOptions?],
  Root
> = (options = defaultRemarkImageOptimizationOptions) => {
  return async (tree) => {
    const imgs: Image[] = [];

    visit(tree, "image", (node, _i, parent) => {
      if (
        (!isParagraph(parent) && !isLink(parent)) ||
        node.url.startsWith("http")
      )
        return;

      imgs.push(node);
    });

    const { imgDir, size, format } = options;

    await Promise.all(
      imgs.map(async (node) => {
        const basename = path.basename(node.url);
        // const buffer = await Bun.file(
        //   path.join(process.cwd(), './src', imgDir, basename),
        // ).arrayBuffer();
        const buffer = fs.readFileSync(
          path.join(process.cwd(), "./src", imgDir, basename)
        );

        const base64 = await getBlur(buffer, size, format);

        node.data = {
          ...node.data,
          hProperties: {
            ...(node.data?.hProperties ?? {}),
            placeholder: base64,
          },
        };
      })
    );
  };
};

export default remarkImageOptimization;
