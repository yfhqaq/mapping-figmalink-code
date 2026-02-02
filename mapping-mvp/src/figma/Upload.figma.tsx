import React from "react";
import figma from "@figma/code-connect";
import { Upload } from "../components/Upload";

figma.connect(Upload, "<FIGMA_UPLOAD_COMPONENT>", {
  props: {
    size: figma.enum("Size", {
      Small: "small",
      Middle: "middle",
      Large: "large",
    }),
    disabled: figma.boolean("Disabled"),
    multiple: figma.boolean("Multiple"),
    accept: figma.string("Accept"),
    label: figma.string("Label"),
  },
  example: (props) => <Upload {...props} />,
});
