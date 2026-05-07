interface PortableTextChild {
  text: string;
  _type: string;
}

interface PortableTextBlock {
  _type: string;
  children?: PortableTextChild[];
}

/**
 * Extracts plain text from a Sanity Portable Text block array.
 */
export function toPlainText(blocks: unknown[] = []) {
  if (!blocks) return "";
  
  return (blocks as PortableTextBlock[])
    .map((block) => {
      if (block._type !== "block" || !block.children) {
        return "";
      }
      return block.children.map((child) => child.text).join("");
    })
    .join("\n");
}
