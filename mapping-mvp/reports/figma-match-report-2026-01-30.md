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

## Matches

### 1) 节点 58:11371（横向Tab/横向Tab）
Matched Component: `Tab`

Confidence: High

Why:
- 该节点由多个 `.Tab元素` 的 INSTANCE 组成，存在 `类型=常规 Tab/关注(数字) Tab` 与 `选中` 的变体
- 文本节点为 Tab 名称（“全部 / 待提交 / 待飞书审核 / …”），结构清晰

Evidence (from node data):
- Component set `.Tab元素`（componentSetId `25:407`）
- Variants: `类型`, `选中`

