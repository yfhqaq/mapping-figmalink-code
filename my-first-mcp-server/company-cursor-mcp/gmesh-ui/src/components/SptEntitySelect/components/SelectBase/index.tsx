import SptSearchSelect from '@/components/SptSearchSelect';
import {
    ProFormSelect,
    ProFormSelectProps,
    ProSchema,
    RequestOptionsType,
} from '@ant-design/pro-components';
import { DefaultOptionType } from 'antd/es/select';
import React, { ReactNode, useCallback } from 'react';

export interface SelectBaseProps<T, U> extends Omit<ProFormSelectProps, 'request' | 'params'> {
    /**
     * 业务类型
     */
    request: (...params: T[]) => Promise<U[]>;
    viewMode?: 'light' | 'normal';
    /**
     * 可以控制业务下拉组件的request请求参数，实现自定义请求参数
     */
    params?: ProSchema<T>['params'] | T;
    format?: (value: U[]) => RequestOptionsType[];
    labelName: keyof U | ((values: U) => ReactNode);
    valueName: keyof U | ((values: U) => string | number | undefined);
}

export function runPropFunction<U>(
    prop: keyof U | ((values: U) => ReactNode),
    item: U,
): DefaultOptionType['label'] | Exclude<DefaultOptionType['value'], null> {
    return (
        typeof prop === 'function'
            ? (prop as (values: U) => string)(item)
            : item[prop as keyof typeof item]
    ) as DefaultOptionType['label'] | Exclude<DefaultOptionType['value'], null>;
}

export const runFormat = (value: any[], format?: (value: any[]) => any[]) => {
    return format ? format(value) : value;
};

const isContainsString = (node: any, searchString: string): boolean => {
    if (typeof node === 'string') {
        const upperSearchString = searchString.toUpperCase();
        return node.toUpperCase().includes(upperSearchString);
    }

    if (Array.isArray(node)) {
        return node.some((child) => isContainsString(child, searchString));
    }

    if (node?.props && node.props.children) {
        return isContainsString(node.props.children, searchString);
    }

    return false;
};

/**
 * 业务下拉组件基础方法，合并所有业务类型的下拉组件
 */
const SelectBase = <T, U>({
    request: customRequest,
    viewMode = 'normal',
    params,
    fieldProps,
    ...props
}: SelectBaseProps<T, U>) => {
    const customFormat = useCallback<(value: U[]) => RequestOptionsType[]>(
        (value: U[]) => {
            return runFormat(value, props.format)?.map((item) => ({
                label: runPropFunction(props.labelName!, item) as ReactNode,
                value: runPropFunction(props.valueName!, item) as string | number | undefined,
            }));
        },
        [props.format, customRequest],
    );

    const customProps: ProFormSelectProps = {
        allowClear: true,
        showSearch: true,
        params: params as any,
        fieldProps: {
            ...fieldProps,
            // 搜索时，过滤掉前后空字符串
            filterOption: (searchValue, option) => {
                searchValue = searchValue.trim();
                if (!searchValue.trim()) {
                    return true;
                }
                return isContainsString(option?.label, searchValue);
            },
        },
        ...props,
        request: async (params) => {
            try {
                const res = await customRequest(params);
                return customFormat(res);
            } catch (error) {
                console.error(error);
                return [];
            }
        },
    };

    const renderedDom =
        viewMode === 'light' ? (
            <SptSearchSelect {...customProps} />
        ) : (
            <ProFormSelect {...customProps} />
        );

    return renderedDom;
};

export default SelectBase;
