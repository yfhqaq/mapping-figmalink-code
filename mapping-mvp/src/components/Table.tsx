import React from "react";

export type TableProps = {
  size?: "small" | "middle" | "large";
  bordered?: boolean;
  pagination?: boolean;
  loading?: boolean;
  emptyText?: string;
};

export function Table({
  size = "middle",
  bordered = false,
  pagination = true,
  loading = false,
  emptyText = "No data",
}: TableProps) {
  return (
    <div data-component="Table" data-size={size}>
      <div>Table (placeholder)</div>
      <div>bordered: {String(bordered)}</div>
      <div>pagination: {String(pagination)}</div>
      <div>loading: {String(loading)}</div>
      <div>empty: {emptyText}</div>
    </div>
  );
}
