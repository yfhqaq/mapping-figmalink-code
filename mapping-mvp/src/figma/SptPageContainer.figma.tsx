import React from "react";
import figma from "@figma/code-connect";
import {
  SptPageContainer,
  type SptPageContainerProps,
} from "../components/SptPageContainer";

figma.connect(SptPageContainer, "<FIGMA_SPT_PAGE_CONTAINER_COMPONENT>", {
  props: {
    tabs: figma.children("Tab"),
  },
  example: (props) => (
    <SptPageContainer {...(props as unknown as SptPageContainerProps)} />
  ),
});
