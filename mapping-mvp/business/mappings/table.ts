import { defineBusinessMapping } from "../registry"

export const tableMappings = [
  defineBusinessMapping({
    id: "table.search.forecastNoList",
    figmaNode:
      "https://www.figma.com/design/7CotWdepNuocaUyrN7Mpjy/V4.3.0-%E4%BA%91%E4%BB%93%E7%B4%A2%E8%B5%94?node-id=46-20522",
    scope: "Table.columns",
    description: "搜索项：索赔单号（用于 Table 的 columns 搜索配置）",
    mappingType: "snippet",
    uxComponent: {
      name: "SearchItem/Select/Tags",
    },
    snippetTemplate: {
      code: {
        title: "索赔单号",
        dataIndex: "forecastNoList",
        valueType: "select",
        fieldProps: {
          style: { minWidth: "296px" },
          mode: "tags",
          open: false,
          tokenSeparators: [",", "，", ";", "；", "\n", " ", "\r"],
          placeholder: "请输入索赔单号",
          className: "keyword-search-select-tag select-no-arrow",
        },
        search: {
          transform: "v => ({ forecastNoList: v.filter(Boolean) })",
        },
        hideInTable: true,
      },
    },
  }),
]
