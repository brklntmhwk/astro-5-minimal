import type { Link, Paragraph, Parent, Text } from "mdast";
import type { Node } from "unist";

function isObject(target: unknown): target is { [k: string]: unknown } {
  return typeof target === "object" && target !== null;
}

function isNode(node: unknown): node is Node {
  return isObject(node) && "type" in node;
}

function is<T extends Node>(node: unknown, type: string): node is T {
  return isNode(node) && node.type === type;
}

export function isLink(node: unknown): node is Link {
  return is(node, "link");
}

export function isBareLink(
  node: unknown
): node is Paragraph & { children: [Link & { children: [Text] }] } {
  return (
    isParagraph(node) &&
    node.children.length === 1 &&
    isLink(node.children[0]) &&
    isText(node.children[0].children[0])
  );
}

export function isParagraph(node: unknown): node is Paragraph {
  return is(node, "paragraph");
}

export function isParent(node: unknown): node is Parent {
  return isObject(node) && "children" in node;
}

export function isText(node: unknown): node is Text {
  return is(node, "text");
}
