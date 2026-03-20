/**
 * 转换表单值辅助函数
 * 该文件提供了一个用于转换表单值的工具函数，可以根据配置进行值的格式化和转换
 */
import { isNil } from '@ant-design/pro-components';
import dayjs from 'dayjs';

/**
 * 转换表单值的函数
 * @param values - 需要转换的原始对象
 * @param searchKeyMap - 转换配置映射，定义了如何转换特定字段
 * @returns 转换后的对象
 */
const transformKey = <T extends object = any>(
    values: T,
    searchKeyMap: Record<
        string,
        {
            transform: (values: any) => Record<string, any>;
            fieldProps: { [key in string]: any };
        }
    >,
) => {
    // 如果不是对象类型、为空或是Blob实例，则直接返回原值
    if (typeof values !== 'object' || isNil(values) || values instanceof Blob) {
        return values;
    }
    // 初始化转换后的值对象
    const transformedValues = {} as Record<string, any> as T;
    // 遍历原始对象的所有属性
    for (const key in values) {
        if (Object.prototype.hasOwnProperty.call(values, key)) {
            let element = values[key];
            // 跳过空值
            if (isNil(element)) {
                continue;
            }
            // 获取当前字段的转换配置
            const searchData = searchKeyMap[key];
            const fieldProps = searchData?.fieldProps;

            // 处理格式化配置，主要用于日期字段
            if (fieldProps?.format) {
                if (typeof fieldProps.format === 'function') {
                    // 如果format是函数，则应用该函数进行格式化
                    element = Array.isArray(element)
                        ? ((element as [any, any])?.map(
                              (item: any) => fieldProps.format(dayjs(item)) as any,
                          ) as any)
                        : fieldProps.format(dayjs(element as any));
                } else if (typeof fieldProps.format === 'string') {
                    // 如果format是字符串，则使用dayjs进行日期格式化
                    element = Array.isArray(element)
                        ? ((element as [any, any])?.map(
                              (item: any) => dayjs(item).format(fieldProps.format) as any,
                          ) as any)
                        : dayjs(element as any).format(fieldProps.format);
                }
            }

            // 应用自定义转换函数
            const transformFunc = searchData?.transform;
            if (transformFunc) {
                // 如果有转换函数，应用该函数并合并结果
                const newKeyMap = transformFunc?.(element);
                Object.assign(transformedValues, newKeyMap);
            } else {
                // 否则直接保留原始值
                transformedValues[key] = element;
            }
        }
    }
    return transformedValues;
};

export default transformKey;
