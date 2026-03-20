import { useEffect, useState } from 'react';
import { SptTableColumn } from '..';
import { SortableListType } from './typing';
import { useRefFunction } from '@spotter/app-client-toolkit';

/**
 * 构造列配置列表数据
 *
 * 1. fixed 判断
 * 2. disableColumnHide 判断
 * 3. 用户初始化排序展示数据 判断
 *
 * @param columns
 * @param initColumnSettingList
 * @returns
 */
export const generatorColumnList: (
    columns: SptTableColumn[],
    initColumnSettingList: SptTableColumn['dataIndex'][],
) => SortableListType = (columns, initColumnSettingList) =>
    [...columns]
        // .filter((item) => !item.hideInTable && item.dataIndex) // 过滤掉 不展示的、为操作列的、为空列的
        .filter((item) => !item.hideInTable) // 过滤掉 不展示的
        .map((item) => ({
            ...item,
            disableChecked:
                !!item.fixed ||
                item.disableColumnHide ||
                item.dataIndex === 'action' ||
                item.valueType === 'option',
            checked:
                !!item.fixed ||
                item.disableColumnHide ||
                item.dataIndex === 'action' ||
                item.valueType === 'option' ||
                initColumnSettingList.indexOf(item.dataIndex) > -1 ||
                initColumnSettingList.length === 0,
        }));

/**
 * 拆分列配置列表数据
 * 1. 拆分 fixed 项
 * 2. 拆分用户初始化排序展示数据
 * @param columns
 * @param initColumnSettingList
 * @returns
 */
export const splitTableColumns = (
    columns: SptTableColumn[],
    initColumnSettingList: SptTableColumn['dataIndex'][],
) => {
    const originColumns = [...generatorColumnList(columns, initColumnSettingList)];
    let columnsWithoutFixed = originColumns.filter((column) => !column.fixed);
    let sortableList: SortableListType = [];
    if (initColumnSettingList.length) {
        // 初始化排序处理，fixed 项不参与排序
        initColumnSettingList.length &&
            initColumnSettingList.forEach((dataIndex) => {
                // 查找该项
                const foundItem = columnsWithoutFixed.find(
                    (item) => item.dataIndex === dataIndex && !item.fixed,
                );
                // 删除该项
                columnsWithoutFixed = columnsWithoutFixed.filter(
                    (item) => item.dataIndex !== dataIndex,
                );
                foundItem && sortableList.push({ ...foundItem });
            });

        // 过滤默认勾选的
        columnsWithoutFixed.forEach((item, index) => {
            if (item.checked) {
                sortableList.push(item);
                columnsWithoutFixed.splice(index, 1);
            }
        });
    } else {
        sortableList = columnsWithoutFixed;
    }
    // 处理 fixed 项
    const fixedLeftColumns: SortableListType = [];
    const fixedRightColumns: SortableListType = [];
    originColumns.forEach((column) => {
        if (column?.fixed && ['left', 'right', true].includes(column.fixed)) {
            column.fixed === 'right'
                ? fixedRightColumns.push(column)
                : fixedLeftColumns.push(column);
        }
    });

    return { fixedLeftColumns, sortableList, fixedRightColumns };
};

/**
 * 构造排序数据列表
 * @param columns
 * @param initColumnSettingList
 * @returns
 */
export const generatorSortList: (
    columns: SptTableColumn[],
    initColumnSettingList: SptTableColumn['dataIndex'][],
) => SortableListType = (columns, initColumnSettingList) => {
    const { fixedLeftColumns, sortableList, fixedRightColumns } = splitTableColumns(
        columns,
        initColumnSettingList,
    );
    return [...fixedLeftColumns, ...sortableList, ...fixedRightColumns];
};

/**
 * 过滤列定义，区分查询表单和表格列定义，并返回对应独立的列定义
 * @param columns SptTable 的列配置数组
 * @returns { formColumns: 用于查询表单的列, tableColumns: 用于表格的列 }
 */
export const filterSptTableColumns = (columns: any[]) => {
    const formColumns: any[] = [];
    const tableColumns: any[] = [];

    columns.forEach((column) => {
        // 判断是否出现在查询表单中的条件：
        // 1. search 为 false 或者 hideInSearch 为 true
        const isInForm = !column?.hideInSearch && column?.search !== false;

        // 判断是否出现在表格中的条件：
        // 1. 未隐藏于表格 (hideInTable !== true)
        const isInTable = !column?.hideInTable;

        if (isInForm) formColumns.push({ ...column });
        if (isInTable) tableColumns.push({ ...column });
    });

    return {
        formColumns: formColumns.map((item) => ({
            ...item,
            hideInTable: true,
        })),
        tableColumns: tableColumns.map((item) => ({
            ...item,
            search: false,
        })),
    };
};

/**
 * 计算两个排序数组的差集
 * @param oldKeys
 * @param newKeys
 * @returns
 */
export const diffSortKeys = (oldKeys: string[], newKeys: string[]) => {
    const oldSet = new Set(oldKeys);
    const newSet = new Set(newKeys);
    const added = [...newSet].filter((x) => !oldSet.has(x));
    const removed = [...oldSet].filter((x) => !newSet.has(x));
    return { added, removed };
};

/**
 * 自定义钩子，用于过滤 SptTable 的列配置，返回用于查询表单和表格的列配置，以及表格原始排序 keys
 * @param columns SptTable 的列配置数组
 * @returns { formColumns: 用于查询表单的列, tableColumns: 用于表格的列, tableOriginSortKeys: 表格原始排序 keys }
 */
export const useFilterSptTableColumns = (columns: SptTableColumn[]) => {
    const [columnsMap, setColumnsMap] = useState<{
        formColumns: SptTableColumn[];
        tableColumns: SptTableColumn[];
        tableOriginSortKeys: string[]; // 表格原始排序 keys
        initialized: boolean;
    }>(() => {
        const { formColumns, tableColumns } = filterSptTableColumns(columns);
        return {
            formColumns,
            tableColumns,
            tableOriginSortKeys: generatorSortList(tableColumns, []).map((item) => item.dataIndex),
            initialized: true,
        };
    });

    const updateColumnsMap = useRefFunction(() => {
        if (!columnsMap.initialized) return;
        const { formColumns, tableColumns } = filterSptTableColumns(columns);
        setColumnsMap({
            formColumns,
            tableColumns,
            tableOriginSortKeys: generatorSortList(tableColumns, []).map((item) => item.dataIndex),
            initialized: true,
        });
    });

    useEffect(() => {
        updateColumnsMap();
    }, [columns]);
    return columnsMap;
};

/**
 * 合并新增的排序 keys 到当前排序 keys
 * @param addKeys 新增的排序 keys
 * @param currentKeys 当前排序 keys
 * @param tableColumns SptTable 的列配置数组
 * @returns
 */
export const mergeAddSortKeys = (
    addKeys: string[],
    currentKeys: string[],
    tableColumns: SptTableColumn[],
) => {
    const { fixedLeftColumns, sortableList, fixedRightColumns } = splitTableColumns(
        tableColumns,
        currentKeys,
    );
    const addColumns = addKeys.map((key) => {
        return tableColumns.find((item) => item.dataIndex === key);
    });
    return [...fixedLeftColumns, ...sortableList, ...addColumns, ...fixedRightColumns].map(
        (item) => item?.dataIndex,
    );
};
