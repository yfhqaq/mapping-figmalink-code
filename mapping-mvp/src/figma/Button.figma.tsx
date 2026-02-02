import React from "react";
import figma from "@figma/code-connect";
import { Button } from "../components/Button";

figma.connect(Button, "<FIGMA_BUTTON_COMPONENT_SET>", {
  props: {
    label: figma.string("按钮"),
    type: figma.enum("类型", {
      一级按钮: "primary",
      二级按钮: "default",
      白底按钮: "default",
      虚线按钮: "dashed",
      文本按钮: "text",
      链接: "link",
      图标按钮: "default",
    }),
    size: figma.enum("尺寸", {
      正常: "middle",
      小尺寸: "small",
    }),
    kind: figma.enum("种类", {
      标准: "standard",
      成功: "success",
      失败: "error",
    }),
    disabled: figma.enum("禁用", {
      on: true,
      off: false,
    }),
    loading: figma.enum("加载中", {
      on: true,
      off: false,
    }),
    iconOnly: figma.enum("类型", {
      一级按钮: false,
      二级按钮: false,
      白底按钮: false,
      虚线按钮: false,
      文本按钮: false,
      链接: false,
      图标按钮: true,
    }),
  },
  example: (props) => <Button {...props} />,
});
