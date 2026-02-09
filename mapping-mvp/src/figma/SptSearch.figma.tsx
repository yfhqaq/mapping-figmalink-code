import React from "react";
import figma from "@figma/code-connect";
import {
  SptSearchDateRangePicker,
  SptSearchSelect,
  SptSearchText,
} from "../components/SptSearch";

figma.connect(SptSearchText, "<FIGMA_FILTER_INPUT_SEARCH>", {
  props: {
    label: figma.string("placeholder"),
    placeholder: figma.string("text"),
  },
  example: (props) => <SptSearchText {...(props as any)} />,
});

figma.connect(SptSearchSelect, "<FIGMA_FILTER_SELECT>", {
  props: {
    label: figma.string("标题名称"),
    placeholder: figma.string("text"),
  },
  example: (props) => <SptSearchSelect {...(props as any)} />,
});

figma.connect(SptSearchDateRangePicker, "<FIGMA_FILTER_DATE_RANGE>", {
  props: {
    label: figma.string("日期"),
  },
  example: (props) => <SptSearchDateRangePicker {...(props as any)} />,
});
