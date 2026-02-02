import React from "react";

export type ButtonProps = {
  label?: string;
  type?: "primary" | "default" | "dashed" | "text" | "link";
  size?: "middle" | "small";
  danger?: boolean;
  loading?: boolean;
  disabled?: boolean;
  kind?: "standard" | "success" | "error";
  iconOnly?: boolean;
};

export function Button({
  label = "Button",
  type = "default",
  size = "middle",
  danger = false,
  loading = false,
  disabled = false,
  kind = "standard",
  iconOnly = false,
}: ButtonProps) {
  return (
    <button
      data-component="Button"
      data-type={type}
      data-size={size}
      data-kind={kind}
      data-danger={danger}
      data-loading={loading}
      data-icon-only={iconOnly}
      disabled={disabled}
      type="button"
    >
      {iconOnly ? "[icon]" : label}
    </button>
  );
}
