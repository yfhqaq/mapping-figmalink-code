import { SptTableColumn } from '..';

export interface ColumnSettingCacheValue {
    name: string;
    sortKeys: SptTableColumn['dataIndex'][];
}

export interface ColumnSettingCache {
    // 当前预设索引
    currentSettingIndex: number;
    // 默认预设排序
    defaultSortKeys: SptTableColumn['dataIndex'][];
    // 表格列原始的排序
    originSortKeys: SptTableColumn['dataIndex'][];
    // 预设列表
    settings: ColumnSettingCacheValue[];
}

export interface SortableItemType extends SptTableColumn {
    // checkbox 禁用可选
    disableChecked?: boolean;
    // 是否已选中
    checked?: boolean;
    // 排序顺序
    columnOrder?: number;
    // 是否禁用列隐藏
    disableColumnHide?: boolean;
}

export type SortableListType = SortableItemType[];

interface GroupConfItem {
    name: string;
    dataIndexList: SptTableColumn['dataIndex'][];
}

export type ColumnGroupConf = GroupConfItem[];

export type ColumnSettingList = SptTableColumn['dataIndex'][];
