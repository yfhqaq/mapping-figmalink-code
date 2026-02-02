import React from "react";

export type TabProps = {
  label?: string;
  selected?: boolean;
  variant?: "regular";
};

export function Tab({ label = "Tab", selected = false }: TabProps) {
  return (
    <div data-component="Tab" data-selected={selected}>
      {label} {selected ? "(selected)" : ""}
    </div>
  );
}

export type TabsProps = {
  tabs?: Array<{ label: string; selected?: boolean }>;
};

export function Tabs({ tabs = [] }: TabsProps) {
  return (
    <div data-component="Tabs">
      {tabs.map((tab) => (
        <Tab key={tab.label} label={tab.label} selected={tab.selected} />
      ))}
    </div>
  );
}
