import React from "react";
import figma from "@figma/code-connect";
import { SidebarNav, SidebarNavItem } from "../components/SidebarNav";

figma.connect(SidebarNav, "<FIGMA_SIDEBAR_NAV>", {
  props: {
    app: figma.enum("应用", {
      Gmesh: "Gmesh",
      SEVC: "SEVC",
      CRM: "CRM",
      CSM: "CSM",
      Developer: "Developer",
    }),
    secondLevelExpanded: figma.enum("二级导航展开", {
      on: true,
      off: false,
    }),
    firstSecondExpanded: figma.enum("一二级导航展开", {
      on: true,
      off: false,
    }),
  },
  example: (props) => <SidebarNav {...props} />,
});

figma.connect(SidebarNavItem, "<FIGMA_SIDEBAR_LEVEL1_COLLAPSED>", {
  props: {
    level: "level1" as const,
    selected: figma.enum("选中", {
      on: true,
      off: false,
    }),
  },
  example: (props) => <SidebarNavItem {...props} />,
});

figma.connect(SidebarNavItem, "<FIGMA_SIDEBAR_LEVEL1_EXPANDED>", {
  props: {
    level: "level1" as const,
    selected: figma.enum("选中", {
      on: true,
      off: false,
    }),
  },
  example: (props) => <SidebarNavItem {...props} />,
});

figma.connect(SidebarNavItem, "<FIGMA_SIDEBAR_LEVEL2>", {
  props: {
    level: "level2" as const,
    expanded: figma.enum("展开", {
      on: true,
      off: false,
    }),
  },
  example: (props) => <SidebarNavItem {...props} />,
});

figma.connect(SidebarNavItem, "<FIGMA_SIDEBAR_LEVEL3>", {
  props: {
    level: "level3" as const,
    selected: figma.enum("选中", {
      on: true,
      off: false,
    }),
  },
  example: (props) => <SidebarNavItem {...props} />,
});
