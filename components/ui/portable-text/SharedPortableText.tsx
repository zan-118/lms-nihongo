import { PortableText, PortableTextComponents, TypedObject } from "@portabletext/react";
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

export function SharedPortableText({ value }: { value: unknown }) {
  // Cast to TypedObject[] to satisfy PortableText component requirements
  return <PortableText value={value as TypedObject[]} components={sharedPtComponents} />;
}
