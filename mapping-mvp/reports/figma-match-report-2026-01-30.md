# Figma Component Match Report (MVP)

Date: 2026-01-30
Source: V4.3.0 云仓索赔

## Inputs
- 节点 46:4311（新增索赔申请菜单）
  - https://www.figma.com/design/7CotWdepNuocaUyrN7Mpjy/V4.3.0-%E4%BA%91%E4%BB%93%E7%B4%A2%E8%B5%94?node-id=46-4311&m=dev
- 节点 58:11371（横向Tab/横向Tab）
  - https://www.figma.com/design/7CotWdepNuocaUyrN7Mpjy/V4.3.0-%E4%BA%91%E4%BB%93%E7%B4%A2%E8%B5%94?node-id=58-11371&m=dev
- 节点 25:3210（卡片）
  - https://www.figma.com/design/7CotWdepNuocaUyrN7Mpjy/V4.3.0-%E4%BA%91%E4%BB%93%E7%B4%A2%E8%B5%94?node-id=25-3210&m=dev

## Mapping Context Used
- mapping-mvp/src/figma/Tab.figma.tsx
- mapping-mvp/src/figma/SidebarNav.figma.tsx
- mapping-mvp/src/figma/Table.figma.tsx
- mapping-mvp/src/figma/Upload.figma.tsx

## Matches

### 1) 节点 46:4311（新增索赔申请菜单）
Matched Component: `SidebarNav`

Confidence: High

Why:
- 该节点内大量 `.一级/收起`、`.二级`、`.三级` 的 INSTANCE，且为同一套菜单组件集合（带展开/选中变体）
- 结构上是典型的侧边导航组合：一级菜单 + 多级展开 + 选中态

Evidence (from node data):
- Instances: `.一级/收起` componentId `25:3138/25:3140`
- Instances: `.二级` componentId `25:3189`
- Instances: `.三级` componentId `25:3198/25:3200`

---

### 2) 节点 58:11371（横向Tab/横向Tab）
Matched Component: `Tab`

Confidence: High

Why:
- 该节点由多个 `.Tab元素` 的 INSTANCE 组成，存在 `类型=常规 Tab/关注(数字) Tab` 与 `选中` 的变体
- 文本节点为 Tab 名称（“全部 / 待提交 / 待飞书审核 / …”），结构清晰

Evidence (from node data):
- Component set `.Tab元素`（componentSetId `25:407`）
- Variants: `类型`, `选中`

---

### 3) 节点 25:3210（卡片）
Matched Components:
- `Tab` (nested)
- `Table` (nested)

Confidence: Medium

Why:
- 节点内包含 `横向Tab/横向Tab`（与节点 58:11371 结构一致）
- 节点内存在成组的 `.表头-文本`、`.单元格-表体`、`.单元格-操作`、以及 `分页`，符合表格结构

Evidence (from node data):
- `.表头-文本` componentSetId `25:1023`
- `.单元格-表体` componentSetId `25:2643`
- `.单元格-操作` componentSetId `25:2718`
- `分页` componentId `25:3110`

Notes:
- 当前 MVP 只映射了 `Table` 基础组件，表头/单元格/分页是表格子结构；需要时可扩展为更细的子组件映射。

---

## Unmatched / Not In MVP Mapping
在这些节点中还出现了多个未映射组件（本次 MVP 不覆盖）：
- 筛选器 / 输入搜索 / 下拉筛选 / 日期筛选
- 按钮 / 图标 / 徽标
- 分页子元素

## Next Actions (Optional)
- 若要提高 `Table` 匹配精度，可以新增：
  - `TableHeaderCell`
  - `TableBodyCell`
  - `TableOperationCell`
  - `Pagination`
- 若你希望我扩展映射，请发这些组件的设计节点链接即可。
