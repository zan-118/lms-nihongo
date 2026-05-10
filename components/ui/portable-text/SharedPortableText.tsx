import { PortableText, PortableTextComponents } from "@portabletext/react";
import { ptMarks } from "./PortableTextMarks";
import { ptBlock, ptList, ptListItem } from "./PortableTextBlock";
import { ptTypes } from "./PortableTextTypes";

export const sharedPtComponents: PortableTextComponents = {
  marks: ptMarks,
  block: ptBlock,
  list: ptList,
  listItem: ptListItem,
  types: ptTypes,
};

export function SharedPortableText({ value }: { value: any }) {
  return <PortableText value={value as any[]} components={sharedPtComponents} />;
}
