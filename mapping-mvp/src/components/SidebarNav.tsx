import React from "react";

export type SidebarNavProps = {
  app?: "Gmesh" | "SEVC" | "CRM" | "CSM" | "Developer";
  secondLevelExpanded?: boolean;
  firstSecondExpanded?: boolean;
};

export function SidebarNav({
  app = "Gmesh",
  secondLevelExpanded = false,
  firstSecondExpanded = false,
}: SidebarNavProps) {
  return (
    <div data-component="SidebarNav" data-app={app}>
      <div>SidebarNav (placeholder)</div>
      <div>secondLevelExpanded: {String(secondLevelExpanded)}</div>
      <div>firstSecondExpanded: {String(firstSecondExpanded)}</div>
    </div>
  );
}

export type SidebarNavItemProps = {
  level?: "level1" | "level2" | "level3";
  selected?: boolean;
  expanded?: boolean;
  label?: string;
};

export function SidebarNavItem({
  level = "level1",
  selected = false,
  expanded = false,
  label = "Item",
}: SidebarNavItemProps) {
  return (
    <div data-component="SidebarNavItem" data-level={level}>
      {label} {selected ? "(selected)" : ""} {expanded ? "(expanded)" : ""}
    </div>
  );
}
