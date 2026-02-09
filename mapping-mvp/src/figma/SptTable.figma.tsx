import React from "react";
import figma from "@figma/code-connect";
import { SptTable, type SptTableProps } from "../components/SptTable";

figma.connect(SptTable, "<FIGMA_SPT_TABLE_COMPONENT>", {
  props: {},
  example: (props) => <SptTable {...(props as SptTableProps)} />,
});
