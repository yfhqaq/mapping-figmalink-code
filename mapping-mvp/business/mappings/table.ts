import { defineBusinessMapping } from "../registry"

export const tableMappings = [
  defineBusinessMapping({
    id: "table.container.spt",
    figmaNode:
      "https://www.figma.com/design/7CotWdepNuocaUyrN7Mpjy/V4.3.0-%E4%BA%91%E4%BB%93%E7%B4%A2%E8%B5%94?node-id=25-3210",
    scope: "SptPageContainer.wrap",
    description: "页面表格区域外层容器：SptPageContainer",
    mappingType: "component",
    uxComponent: {
      name: "SptPageContainer",
    },
  }),
  defineBusinessMapping({
    id: "table.tabs.spt",
    figmaNode:
      "https://www.figma.com/design/7CotWdepNuocaUyrN7Mpjy/V4.3.0-%E4%BA%91%E4%BB%93%E7%B4%A2%E8%B5%94?node-id=58-11371",
    scope: "SptPageContainer.tabs",
    description: "顶部 Tab 区域，使用 SptPageContainer.tabs（TabPaneProps + count）",
    mappingType: "snippet",
    snippetTemplate: {
      code: {
        tabs: [
          { tab: "全部", tabKey: "all", count: 0 },
          { tab: "待提交", tabKey: "pendingSubmit", count: 8 },
          { tab: "待飞书审核", tabKey: "pendingFeishuApproval", count: 5 },
          { tab: "待云仓确认", tabKey: "pendingWarehouseConfirm", count: 2 },
        ],
        basePath: "/warehouse/claim_application",
      },
    },
  }),
  defineBusinessMapping({
    id: "table.search.area",
    figmaNode:
      "https://www.figma.com/design/7CotWdepNuocaUyrN7Mpjy/V4.3.0-%E4%BA%91%E4%BB%93%E7%B4%A2%E8%B5%94?node-id=25-3212",
    scope: "SptTable.search",
    description:
      "筛选区域（业务封装搜索组件集合），占位：后续补充真实搜索组件配置",
    mappingType: "description",
  }),
  defineBusinessMapping({
    id: "table.search.text.tags",
    figmaNode:
      "https://www.figma.com/design/7CotWdepNuocaUyrN7Mpjy/V4.3.0-%E4%BA%91%E4%BB%93%E7%B4%A2%E8%B5%94?node-id=25-3213",
    scope: "SptTable.search",
    description: "搜索文本（多值/Tags 输入）列配置模板",
    mappingType: "snippet",
    snippetTemplate: {
      code: {
        title: "搜索label",
        dataIndex: "搜索字段名称",
        width: "组件宽度（数字）",
        valueType: "select",
        fieldProps: {
          style: { minWidth: "296px" },
          mode: "tags",
          open: false,
          tokenSeparators: [",", "，", ";", "；", "\n", " ", "\r"],
          placeholder: "请输入搜索内容",
          className: "keyword-search-select-tag select-no-arrow",
        },
        search: {
          transform: "v => ({ forecastNoList: v.filter(Boolean) })",
        },
        hideInTable: true,
      },
    },
  }),
  defineBusinessMapping({
    id: "table.search.select.enum",
    figmaNode:
      "https://www.figma.com/design/7CotWdepNuocaUyrN7Mpjy/V4.3.0-%E4%BA%91%E4%BB%93%E7%B4%A2%E8%B5%94?node-id=25-3214",
    scope: "SptTable.search",
    description: "下拉筛选（前端枚举 options）列配置模板",
    mappingType: "snippet",
    snippetTemplate: {
      code: {
        title: "搜索label",
        dataIndex: "搜索字段名称",
        width: 175,
        valueType: "select",
        fieldProps: {
          options: [
            { label: "库内丢失", value: "ClaimType.InventoryLoss" },
            { label: "库内破损", value: "ClaimType.InventoryDamage" },
            { label: "延迟发货", value: "ClaimType.DeliveryDelay" },
            { label: "虚假发货", value: "ClaimType.FraudulentShipment" },
            { label: "其他罚款", value: "ClaimType.MiscellaneousPenalties" },
            { label: "少发", value: "ClaimType.ShortShipment" },
            { label: "多发", value: "ClaimType.OverShipment" },
            { label: "错发", value: "ClaimType.IncorrectShipment" },
            { label: "物流未上网", value: "ClaimType.MissingTracking" },
            { label: "VC贴错标", value: "ClaimType.VcLabelingError" },
          ],
          placeholder: "请选择",
        },
        hideInTable: true,
      },
    },
  }),
  defineBusinessMapping({
    id: "table.search.date.range.presets",
    figmaNode:
      "https://www.figma.com/design/7CotWdepNuocaUyrN7Mpjy/V4.3.0-%E4%BA%91%E4%BB%93%E7%B4%A2%E8%B5%94?node-id=25-3220",
    scope: "SptTable.search",
    description: "日期区间（带预设）列配置模板",
    mappingType: "snippet",
    snippetTemplate: {
      code: {
        title: "创建日期",
        dataIndex: "createDateMs",
        width: 124,
        valueType: "dateRangerByPresets",
        fieldProps: {
          placeholder: ["开始日期", "结束日期"],
        },
        search: {
          transform:
            "tzTimestampRangeTransformer(['createDateMsStart', 'createDateMsEnd'])",
        },
        hideInTable: true,
      },
    },
  }),
  defineBusinessMapping({
    id: "table.search.date.range",
    figmaNode:
      "https://www.figma.com/design/7CotWdepNuocaUyrN7Mpjy/V4.3.0-%E4%BA%91%E4%BB%93%E7%B4%A2%E8%B5%94?node-id=25-3220",
    scope: "SptTable.search",
    description: "日期区间（无预设）列配置模板",
    mappingType: "snippet",
    snippetTemplate: {
      code: {
        title: "创建日期",
        dataIndex: "createDateMs",
        width: 124,
        valueType: "dateTimeRange",
        fieldProps: {
          placeholder: ["开始日期", "结束日期"],
        },
        search: {
          transform:
            "tzTimestampRangeTransformer(['createDateMsStart', 'createDateMsEnd'])",
        },
        hideInTable: true,
      },
    },
  }),
  defineBusinessMapping({
    id: "table.columns.valueType.map",
    figmaNode:
      "https://www.figma.com/design/7CotWdepNuocaUyrN7Mpjy/V4.3.0-%E4%BA%91%E4%BB%93%E7%B4%A2%E8%B5%94?node-id=25-3231",
    scope: "SptTable.columns",
    description:
      "columns 的 valueType 映射（SptProColumns + valueTypeMap），占位：后续补充完整 map/组件",
    mappingType: "snippet",
    snippetTemplate: {
      code: {
        valueTypeKeys: [
          "company",
          "companyCode",
          "storage",
          "site",
          "country",
          "sptDateMonth",
          "sptDateDay",
          "sptDateTime",
          "dateMinute",
          "dateSecond",
          "dateDayRange",
          "dateTimeUTC8",
          "dateMinuteUTC8",
          "financeCurrency",
          "dateRangerByPresets",
        ],
        valueTypeMap: {
          company: "SptCompanySelect",
          companyCode: "SptCompanySelect(valueField=businessCode)",
          sptDateMonth: "ProFormDateMonthRangePicker",
          sptDateDay: "SptSearchDateRangePicker",
          sptDateTime: "ProFormDateTimeRangePicker",
          dateMinute: "tzTimeFormatter(TIME_MINUTE_FORMAT)",
          dateSecond: "tzTimeFormatter(TIME_SECOND_FORMAT)",
          dateDayRange: "ProFormDateRangePicker",
          financeCurrency: "financeCurrencyFormatter",
          dateTimeUTC8: "timeFormatter",
          dateMinuteUTC8: "timeFormatter(TIME_MINUTE_FORMAT)",
          storage: "SptStoreSelect",
          site: "MultiSite",
          country: "CountrySelect",
          dateRangerByPresets: "DateRangePickerWithPreset",
        },
      },
    },
  }),
  defineBusinessMapping({
    id: "table.column.id-cell",
    figmaNode:
      "https://www.figma.com/design/7CotWdepNuocaUyrN7Mpjy/V4.3.0-%E4%BA%91%E4%BB%93%E7%B4%A2%E8%B5%94?node-id=25-3251",
    scope: "SptTable.columns",
    description:
      "列模板：单号/ID 类字段（BaseIdCell + 可复制，来源 @spotter/supply-ui）",
    mappingType: "snippet",
    snippetTemplate: {
      code: {
        title: "某某单号",
        dataIndex: "渲染的单号字段",
        width: 144,
        render:
          "(_, record) => (<BaseIdCell data={[{ value: record?.渲染的单号字段, copyable: true }]} />)",
        hideInSearch: true,
      },
    },
  }),
  defineBusinessMapping({
    id: "table.column.time",
    figmaNode:
      "https://www.figma.com/design/7CotWdepNuocaUyrN7Mpjy/V4.3.0-%E4%BA%91%E4%BB%93%E7%B4%A2%E8%B5%94?node-id=25-3395",
    scope: "SptTable.columns",
    description: "列模板：时间字段（可排序）",
    mappingType: "snippet",
    snippetTemplate: {
      code: {
        title: "label字符串",
        dataIndex: "渲染的时间字段",
        width: 160,
        sorter: true,
        defaultSortOrder: "descend",
        sortDirections: ["descend", "ascend"],
        render:
          "(_, record) => tzTimeFormatter(record?.createDateMs, TIME_SECOND_FORMAT, DEFAULT_TIMEZONE)",
        hideInSearch: true,
      },
    },
  }),
  defineBusinessMapping({
    id: "table.column.status.dot",
    figmaNode:
      "https://www.figma.com/design/7CotWdepNuocaUyrN7Mpjy/V4.3.0-%E4%BA%91%E4%BB%93%E7%B4%A2%E8%B5%94?node-id=48-5192",
    scope: "SptTable.columns",
    description: "列模板：圆点状态（基于 status 枚举渲染颜色）",
    mappingType: "snippet",
    snippetTemplate: {
      code: {
        hideInSearch: true,
        statusMap: {
          "AppointmentOrderEnum.WAIT_CONFIRMED": {
            text: "待确认",
            status: "warning",
          },
          "AppointmentOrderEnum.SUCCESS": {
            text: "预约成功",
            status: "processing",
          },
          "AppointmentOrderEnum.RECEIVED": {
            text: "已到仓",
            status: "success",
          },
        },
      },
    },
  }),
  defineBusinessMapping({
    id: "table.column.status.dot.badge",
    figmaNode:
      "https://www.figma.com/design/7CotWdepNuocaUyrN7Mpjy/V4.3.0-%E4%BA%91%E4%BB%93%E7%B4%A2%E8%B5%94?node-id=48-5648",
    scope: "SptTable.columns",
    description: "列模板：圆点状态 + 自定义渲染（含 badge/icon）",
    mappingType: "snippet",
    snippetTemplate: {
      code: {
        hideInSearch: true,
        statusMap: {
          "NEW_INBOUND_STATUS.ON_WAY": {
            label: "待收货",
            text: "待收货",
            order: 2,
            status: "warning",
            badge:
              "(subStatus) => cainiaoBadgeFun({ subStatus, text: '待收货', status: 'processing' })",
            value: "NEW_INBOUND_STATUS.ON_WAY",
          },
          "NEW_INBOUND_STATUS.RECEIVING": {
            label: "收货中",
            text: "收货中",
            order: 2,
            status: "warning",
            badge:
              "(subStatus) => cainiaoBadgeFun({ subStatus, text: '收货中', status: 'processing' })",
            value: "NEW_INBOUND_STATUS.RECEIVING",
          },
          "NEW_INBOUND_STATUS.LISTED": {
            label: "已收货",
            text: "已收货",
            order: 6,
            status: "success",
            badge:
              "(subStatus, className) => (<div className={className}>{cainiaoBadgeFun({ subStatus, text: '已收货', status: 'success' })}</div>)",
            value: "NEW_INBOUND_STATUS.LISTED",
          },
          "NEW_INBOUND_STATUS.CANCEL": {
            label: "已取消",
            text: "已取消",
            order: 7,
            status: "default",
            badge:
              "(subStatus) => cainiaoBadgeFun({ subStatus, text: '已取消', status: 'default' })",
            value: "NEW_INBOUND_STATUS.CANCEL",
          },
        },
      },
    },
  }),
  defineBusinessMapping({
    id: "table.toolbar.render",
    figmaNode:
      "https://www.figma.com/design/7CotWdepNuocaUyrN7Mpjy/V4.3.0-%E4%BA%91%E4%BB%93%E7%B4%A2%E8%B5%94?node-id=25-3227",
    scope: "SptTable.toolbarRender",
    description: "表格操作区 -> SptTable.toolbarRender，占位：后续补充按钮组代码",
    mappingType: "snippet",
    snippetTemplate: {
      code: {
        TODO: "补充 toolbarRender 按钮组业务代码",
      },
    },
  }),
  defineBusinessMapping({
    id: "table.component.spt",
    figmaNode:
      "https://www.figma.com/design/7CotWdepNuocaUyrN7Mpjy/V4.3.0-%E4%BA%91%E4%BB%93%E7%B4%A2%E8%B5%94?node-id=25-3231",
    scope: "SptTable.component",
    description:
      "表格主体对应 SptTable（与 search/columns/toolbar 同步配置，包含架构参考）",
    mappingType: "snippet",
    snippetTemplate: {
      code: {
        component: "SptTable",
        childContexts: [
          {
            scope: "SptTable.search",
            description: "筛选区域（搜索组件配置集合）",
            placeholder: "在该 scope 下补充搜索项模板或业务片段",
          },
          {
            scope: "SptTable.columns",
            description: "表格列配置（SptProColumns 列表）",
            placeholder: "在该 scope 下补充列配置模板或业务片段",
          },
          {
            scope: "SptTable.toolbarRender",
            description: "表格操作区（按钮/操作组）",
            placeholder: "在该 scope 下补充 toolbarRender 业务代码",
          },
        ],
        assemblyHint:
          "生成代码时优先读取以上子上下文，组装为同一个 SptTable：columns=[...searchColumns, ...tableColumns]，toolbarRender=renderToolbar。",
        architectureGuide: {
          singleTab: {
            summary:
              "SptPageContainer -> SptTable；搜索列与展示列分离，search 统一 hideInTable，展示列统一 hideInSearch。",
            skeleton: `
List/
  Columns/
    SearchColumns.tsx      // 入口：re-export ./search
    TableColumns.tsx       // 入口：re-export ./table
    search/
      base.tsx             // 搜索基础字段（buildXxxSearchColumn）
      index.ts             // export base + export builders
    table/
      base.tsx             // 表格基础列（buildXxxTableColumn）
      index.ts             // export base + export builders
  components/             // 列表公共组件（导出/复制/批量操作）
  Table.tsx               // 单表容器：组装 columns/toolbar/search
  const.ts                // 常量/枚举

Table.tsx:
  const searchColumns = buildSearchColumns()
  const tableColumns = buildTableColumns()
  return (
    <SptPageContainer>
      <SptTable
        columns={[...searchColumns, ...tableColumns]}
        toolbarRender={renderToolbar}
      />
    </SptPageContainer>
  )`,
          },
          multiTab: {
            summary:
              "多 Tab 建议按“目录分层 + 组合函数”组织，避免所有逻辑堆在同一文件。",
            skeleton: `
List/
  Columns/
    SearchColumns.tsx      // 入口：re-export ./search
    TableColumns.tsx       // 入口：re-export ./table
    search/
      base.tsx             // 搜索基础字段（buildXxxSearchColumn）
      tabs/
        tabA.ts             // buildTabASearchColumns(...)
        tabB.ts             // buildTabBSearchColumns(...)
      index.ts             // export base + export tabs/*
    table/
      base.tsx             // 表格基础列（buildXxxTableColumn），含 Figma 链接注释
      tabs/
        tabA.ts             // buildTabATableColumns(...)
        tabB.ts             // buildTabBTableColumns(...)
      index.ts             // export base + export tabs/*
  components/             // 列表公共组件（导出/复制/批量操作）
  Tabs/                   // 每个 Tab 的表格组件
  const.ts                // Tab 枚举、常量

SptPageContainer.tabs 负责切换；每个 Tab 组件只组装 columns/toolbar/search`,
          },
        },
      },
    },
  }),
  defineBusinessMapping({
    id: "table.columns.config",
    figmaNode:
      "https://www.figma.com/design/7CotWdepNuocaUyrN7Mpjy/V4.3.0-%E4%BA%91%E4%BB%93%E7%B4%A2%E8%B5%94?node-id=25-3232",
    scope: "SptTable.columns",
    description: "表格列配置（复用既有业务列配置），占位：后续补充 columns 配置",
    mappingType: "snippet",
    snippetTemplate: {
      code: {
        TODO: "补充 columns 业务配置（已存在的列配置复用）",
      },
    },
  }),
  defineBusinessMapping({
    id: "table.search.forecastNoList",
    figmaNode:
      "https://www.figma.com/design/7CotWdepNuocaUyrN7Mpjy/V4.3.0-%E4%BA%91%E4%BB%93%E7%B4%A2%E8%B5%94?node-id=46-20522",
    scope: "Table.columns",
    description: "搜索项：索赔单号（用于 Table 的 columns 搜索配置）",
    mappingType: "snippet",
    uxComponent: {
      name: "SearchItem/Select/Tags",
    componentSetId: "16593:180940",
    componentId: "16593:180937",
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
