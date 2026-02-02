import React from "react";

export type UploadProps = {
  size?: "small" | "middle" | "large";
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  label?: string;
};

export function Upload({
  size = "middle",
  disabled = false,
  multiple = false,
  accept,
  label = "Upload",
}: UploadProps) {
  return (
    <div data-component="Upload" data-size={size}>
      <div>Upload (placeholder)</div>
      <div>label: {label}</div>
      <div>disabled: {String(disabled)}</div>
      <div>multiple: {String(multiple)}</div>
      <div>accept: {accept || "any"}</div>
    </div>
  );
}
