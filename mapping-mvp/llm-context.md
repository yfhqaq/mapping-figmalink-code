# LLM Mapping Context (MVP)

This file summarizes the current Code Connect-style mappings.
Source of truth is in `src/figma/*.figma.tsx`.

## Components

### Table
- Code component: `Table` (`src/components/Table.tsx`)
- Mapping file: `src/figma/Table.figma.tsx`
- Figma URL placeholder: `<FIGMA_TABLE_COMPONENT>`
- Key props:
  - `size`: enum `Small | Middle | Large` → `small | middle | large`
  - `bordered`: boolean
  - `pagination`: boolean
  - `loading`: boolean
  - `emptyText`: string

### Upload
- Code component: `Upload` (`src/components/Upload.tsx`)
- Mapping file: `src/figma/Upload.figma.tsx`
- Figma URL placeholder: `<FIGMA_UPLOAD_COMPONENT>`
- Key props:
  - `size`: enum `Small | Middle | Large` → `small | middle | large`
  - `disabled`: boolean
  - `multiple`: boolean
  - `accept`: string
  - `label`: string

### Tabs
- Code component: `Tabs` (`src/components/Tab.tsx`)
- Mapping file: `src/figma/Tab.figma.tsx`
- Figma URL placeholder: `<FIGMA_TABS_CONTAINER>`
- Key props:
  - `tabs`: children of type `Tab`

### Tab Element
- Code component: `Tab` (`src/components/Tab.tsx`)
- Mapping file: `src/figma/Tab.figma.tsx`
- Figma URL placeholder: `<FIGMA_TAB_ELEMENT>`
- Key props:
  - `label`: string
  - `selected`: enum `Yes | No` → `true | false`
  - `variant`: enum `常规 Tab` → `regular`

### Sidebar Navigation
- Code component: `SidebarNav` (`src/components/SidebarNav.tsx`)
- Mapping file: `src/figma/SidebarNav.figma.tsx`
- Figma URL placeholder: `<FIGMA_SIDEBAR_NAV>`
- Key props:
  - `app`: enum `Gmesh | SEVC | CRM | CSM | Developer`
  - `secondLevelExpanded`: enum `on | off` → `true | false`
  - `firstSecondExpanded`: enum `on | off` → `true | false`

### Sidebar Items (Level 1/2/3)
- Code component: `SidebarNavItem` (`src/components/SidebarNav.tsx`)
- Mapping file: `src/figma/SidebarNav.figma.tsx`
- Figma URL placeholders:
  - `<FIGMA_SIDEBAR_LEVEL1_COLLAPSED>`
  - `<FIGMA_SIDEBAR_LEVEL1_EXPANDED>`
  - `<FIGMA_SIDEBAR_LEVEL2>`
  - `<FIGMA_SIDEBAR_LEVEL3>`
- Key props:
  - `level`: `level1 | level2 | level3`
  - `selected`: enum `on | off` → `true | false`
  - `expanded`: enum `on | off` → `true | false`

### Button
- Code component: `Button` (`src/components/Button.tsx`)
- Mapping file: `src/figma/Button.figma.tsx`
- Figma URL placeholder: `<FIGMA_BUTTON_COMPONENT_SET>`
- Key props:
  - `label`: string
  - `type`: enum `一级按钮 | 二级按钮 | 白底按钮 | 虚线按钮 | 文本按钮 | 链接 | 图标按钮` → `primary | default | dashed | text | link`
  - `kind`: enum `标准 | 成功 | 失败` → `standard | success | error`
  - `size`: enum `正常 | 小尺寸` → `middle | small`
  - `disabled`: enum `on | off` → `true | false`
  - `loading`: enum `on | off` → `true | false`
  - `iconOnly`: enum `类型=图标按钮` → `true | false`

## How to use
1. Replace placeholders in `figma.config.json` with real node URLs.
2. Keep this file as LLM context, or feed the `src/figma/*.figma.tsx` files directly.
