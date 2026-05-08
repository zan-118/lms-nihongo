import { PortableTextComponents } from "@portabletext/react";
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
