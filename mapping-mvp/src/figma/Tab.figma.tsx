import React from "react";
import figma from "@figma/code-connect";
import { Tab, Tabs } from "../components/Tab";

figma.connect(Tabs, "<FIGMA_TABS_CONTAINER>", {
  props: {
    tabs: figma.children("Tab") as any,
  },
  example: ({ tabs }) => <Tabs tabs={tabs as any} />,
});

figma.connect(Tab, "<FIGMA_TAB_ELEMENT>", {
  props: {
    label: figma.string("Label"),
    selected: figma.enum("选中", {
      Yes: true,
      No: false,
    }),
    variant: figma.enum("类型", {
      "常规 Tab": "regular",
    }),
  },
  example: (props) => <Tab {...props} />,
});
