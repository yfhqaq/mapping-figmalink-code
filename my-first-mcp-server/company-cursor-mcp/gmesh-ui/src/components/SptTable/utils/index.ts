import { SortOrder } from 'antd/es/table/interface';
import { ProColumnType, ProColumns } from '@ant-design/pro-components';

/**
 * 将 ProTable - column - dataIndex 转为字符串形式
 *
 * @param dataIndex Column 中的 dataIndex
 */
function parseDataIndex(dataIndex: ProColumnType['dataIndex']): string | undefined {
    if (Array.isArray(dataIndex)) {
        return dataIndex.join(',');
    }
    return dataIndex?.toString();
}

/**
 * 从 ProColumns 数组中取出默认的排序和筛选数据
 *
 * @param columns ProColumns
 */
export function parseDefaultColumnConfig<T, Value>(columns: ProColumns<T, Value>[]) {
    const filter: Record<string, (string | number)[] | null> = {} as Record<string, any>;
    const sort: Record<string, SortOrder> = {} as Record<string, any>;
    columns.forEach((column) => {
        // 转换 dataIndex
        const dataIndex = parseDataIndex(column.dataIndex);
        if (!dataIndex) {
            return;
        }
        // 当 column 启用 filters 功能时，取出默认的筛选值
        if (column.filters) {
            const defaultFilteredValue = column.defaultFilteredValue as (string | number)[];
            if (defaultFilteredValue === undefined) {
                filter[dataIndex] = null;
            } else {
                filter[dataIndex] = column.defaultFilteredValue as (string | number)[];
            }
        }
        // 当 column 启用 sorter 功能时，取出默认的排序值
        if (column.sorter && column.defaultSortOrder) {
            sort[dataIndex] = column.defaultSortOrder!;
        }
    });
    return { sort, filter };
}

export const toFloat = (n: number) => +n.toFixed(2);

export const clearSelection = () => {
    const selection = window.getSelection();
    if (selection) {
        if (selection.empty) {
            // Chrome
            selection.empty();
        } else if (selection.removeAllRanges) {
            // Firefox
            selection.removeAllRanges();
        }
    }
};
