import React from "react";
import figma from "@figma/code-connect";
import { Table, type TableProps } from "../components/Table";

figma.connect(Table, "<FIGMA_TABLE_COMPONENT>", {
  props: {
    size: figma.enum("Size", {
      Small: "small",
      Middle: "middle",
      Large: "large",
    }),
    bordered: figma.boolean("Bordered"),
    pagination: figma.boolean("Pagination"),
    loading: figma.boolean("Loading"),
    emptyText: figma.string("Empty Text"),
  },
  example: (props) => <Table {...(props as TableProps)} />,
});
