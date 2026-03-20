import omit from 'omit.js';
import {
    FormInstance,
    ProCoreActionType,
    ProFormColumnsType,
    ProFormField,
    ProFormFieldProps,
    ProProvider,
    ProSchemaComponentTypes,
    isDeepEqualReact,
} from '@ant-design/pro-components';
import React, { memo, useContext } from 'react';
import { runFunction } from '@/utils/runFunction';
import SptSearchSelect from '@/components/SptSearchSelect';
import SptSearchText from '@/components/SptSearchText';
import { SptSearchDatePicker } from '@/components/SptSearchDatePicker';
import { SptSearchDateRangePicker } from '@/components/SptSearchDateRangePicker';
import { SptSearchTreeSelect } from '@/components/SptSearchTreeSelect';
import { omitUndefined } from '@/utils/omitUndefined';
import SptEntitySelect from '@/components/SptEntitySelect';
import SptSearchCascader from '@/components/SptSearchCascader';
import { SptSearchDateTimeRangePicker } from '@/components/SptSearchDateTimeRangePicker';
import { Form } from 'antd';

export type ProFormRenderValueTypeItem<T, ValueType> = {
    label: any;
    getFieldProps?: () => any;
    getFormItemProps?: () => any;
} & ProFormColumnsType<T, ValueType>;

export type ItemType<T, ValueType> = Omit<ProFormRenderValueTypeItem<T, ValueType>, 'key'> & {
    key?: React.Key | React.Key[];
};

export type ProFormRenderValueTypeHelpers<T, ValueType> = {
    originItem: ProFormColumnsType<T, ValueType>;
    type: ProSchemaComponentTypes;
    formRef: React.MutableRefObject<FormInstance<any> | undefined>;
    // genItems: (items: ProFormColumnsType<T, ValueType>[]) => React.ReactNode[];
    action?: React.MutableRefObject<ProCoreActionType | undefined>;
};

export type SptFieldProps<T = any, ValueType = any> = {
    item: ItemType<T, ValueType>;
    helpers: ProFormRenderValueTypeHelpers<T, ValueType>;
};

/**
 * 列表中的valueType，在Filter区域已经被组件处理了，不需要再次处理
 */
const blackList = [
    'company',
    'companyCode',
    'storage',
    'svcCode',
    'svcAccount',
    'vendorCode',
    'sptDateDay',
    'sptDateMonth',
];

// const getDataFormtByValueType = (valueType: string, format?: string) => {
//     if (format) return format;
//     if (valueType === 'dateMonthRange') {
//         return 'YYYY-MM';
//     }

//     return 'string';
// };

const SptField = memo(
    ({ item, helpers }: SptFieldProps) => {
        const context = useContext(ProProvider);
        const { type, action, originItem, formRef } = helpers;
        const formItemProps = item?.getFormItemProps?.();
        const formFieldProps = {
            ...omit(item, [
                'dataIndex',
                'width',
                'render',
                'renderFormItem',
                'renderText',
                'title',
                'valueType',
                'label',
            ]),
            label: formItemProps?.label || item.label,
            name: item.formItemProps?.name || item.name || item.key || item.dataIndex,
            width: item.width as 'md',
            initialValue:
                item.initialValue ||
                (item.formItemProps as any)?.initialValue ||
                formItemProps?.initialValue,
            render: item?.render
                ? (dom, entity, renderIndex) =>
                      item?.render?.(dom, entity, renderIndex, action?.current, {
                          type,
                          ...item,
                          key: item.key?.toString(),
                          formItemProps: item.getFormItemProps?.(),
                          fieldProps: item.getFieldProps?.(),
                      })
                : undefined,
            valueEnum: runFunction(item.valueEnum),
            fieldProps: item?.getFieldProps?.(),
            formItemProps,
        } as ProFormFieldProps;

        // 兜底恢复使用ProComponents的render
        const defaultRender = () => {
            return <ProFormField {...formFieldProps} ignoreFormItem={true} />;
        };

        const renderFormItem = item?.renderFormItem
            ? (_: any, config: any) => {
                  const renderConfig = omitUndefined({ ...config, onChange: undefined });
                  return item?.renderFormItem?.(
                      {
                          type,
                          ...item,
                          key: item.key?.toString(),
                          formItemProps: item.getFormItemProps?.(),
                          fieldProps: item.getFieldProps?.(),
                          originProps: originItem,
                      },
                      {
                          ...renderConfig,
                          defaultRender,
                          type,
                      },
                      formRef.current!,
                  );
              }
            : undefined;

        const renderedDom = () => {
            if (item?.renderFormItem) {
                const dom = renderFormItem?.(null, {});
                // 如果renderFormItem的返回值是null或者undefined，那么就不渲染了
                if (!dom || item.ignoreFormItem) return dom;
            }

            // 从fieldProps中读取值, 目前只有value，后续如果要重构render函数，估计得考虑从dataSource中获取dataValue
            const text = item?.fieldProps?.['value'];
            const dataValue = item?.fieldProps?.value ?? text ?? '';

            // 兼容自定义ValueType的场景
            const valueTypeMap = context.valueTypeMap || {};
            const customValueTypeConfig = valueTypeMap && valueTypeMap[item.valueType as string];

            if (customValueTypeConfig && !blackList?.includes(item.valueType)) {
                const props = {
                    label: item.label,
                    tooltip: item.proFieldProps?.tooltip,
                    transform: item.transform,
                    request: item.request,
                    params: item.params,
                    ...item.fieldProps,
                    ...item.proFieldProps,
                    ...formFieldProps,
                };
                return customValueTypeConfig?.renderFormItem?.(
                    dataValue,
                    {
                        text: dataValue as React.ReactNode,
                        ...props,
                        valueEnum: runFunction(item.valueEnum),
                        viewMode: 'light', // 直接给自定义渲染一个viewMode light的参数
                        mode: 'edit',
                    },
                    <>{dataValue}</>,
                );
            }

            if (renderFormItem) {
                // 处理自定义renderFormItem的场景
                const newDom = renderFormItem?.(text, {
                    mode: 'edit',
                    ...(formFieldProps?.fieldProps ?? {}),
                });
                // renderFormItem 之后的dom可能没有props，所以需要手动加上
                if (React.isValidElement(newDom))
                    return React.cloneElement(newDom, {
                        viewMode: 'light', // 直接给自定义渲染一个viewMode light的参数
                        ...formFieldProps,
                        ...((newDom.props as any) || {}),
                    });
                return newDom;
            }

            if (
                item.valueType === 'select' ||
                (item.valueType === 'text' && (formFieldProps.valueEnum || item.request))
            ) {
                return (
                    <SptSearchSelect
                        noStyle
                        label={item.label}
                        tooltip={item.proFieldProps?.tooltip}
                        transform={item.transform}
                        request={item.request}
                        params={item.params}
                        {...item.fieldProps}
                        {...item.proFieldProps}
                        fieldProps={{
                            ...item.fieldProps,
                        }}
                        {...formFieldProps}
                    />
                );
            }

            if (item.valueType === 'date') {
                return <SptSearchDatePicker noStyle {...formFieldProps} />;
            }

            if (['dateRange', 'sptDateDay'].includes(item.valueType)) {
                return <SptSearchDateRangePicker noStyle {...formFieldProps} />;
            }

            if (item.valueType === 'dateTimeRange') {
                return <SptSearchDateTimeRangePicker noStyle {...formFieldProps} />;
            }

            if (['dateMonthRange', 'sptDateMonth'].includes(item.valueType)) {
                const { fieldProps, ...otherFormFieldProps } = formFieldProps;
                return (
                    <SptSearchDateRangePicker
                        noStyle
                        dataFormat="YYYY-MM"
                        fieldProps={{
                            picker: 'month',
                            format: 'YYYY-MM',
                            ...fieldProps,
                        }}
                        {...otherFormFieldProps}
                    />
                );
            }

            if (item.valueType === 'treeSelect') {
                return <SptSearchTreeSelect noStyle {...formFieldProps} />;
            }
            if (item.valueType === 'company') {
                return (
                    <SptEntitySelect.Company
                        viewMode="light"
                        noStyle
                        {...formFieldProps.fieldProps}
                        {...(formFieldProps as any)}
                    />
                );
            }

            if (item.valueType === 'svcCode' || item.valueType === 'svcAccount') {
                return (
                    <SptEntitySelect.SvcAccount
                        viewMode="light"
                        noStyle
                        {...formFieldProps.fieldProps}
                        {...(formFieldProps as any)}
                    />
                );
            }

            if (item.valueType === 'store' || item.valueType === 'storage') {
                return (
                    <SptEntitySelect.Store
                        viewMode="light"
                        {...formFieldProps.fieldProps}
                        noStyle
                        {...(formFieldProps as any)}
                    />
                );
            }

            if (item.valueType === 'cascader') {
                return <SptSearchCascader noStyle {...formFieldProps} />;
            }

            if (item.valueType === 'companyCode') {
                return (
                    <SptEntitySelect.Company
                        noStyle
                        viewMode="light"
                        valueName="businessCode"
                        {...formFieldProps.fieldProps}
                        {...(formFieldProps as any)}
                    />
                );
            }

            if (item.valueType === 'vendorCode') {
                return (
                    <SptEntitySelect.VendorCode
                        noStyle
                        viewMode="light"
                        valueName="vendorCode"
                        {...formFieldProps.fieldProps}
                        {...(formFieldProps as any)}
                    />
                );
            }

            return <SptSearchText noStyle {...formFieldProps} />;
        };

        return (
            <Form.Item
                name={formFieldProps.name}
                style={{ marginBottom: 0 }}
                // transform={item.transform}
                // dataFormat={getDataFormtByValueType(item.valueType, item.fieldProps?.format)}
                // valueType={item.valueType}
                key={item.proFieldProps?.proFieldKey || item.name?.toString()}
                {...omit(formFieldProps.formItemProps!, ['label', 'initialValue'])}
            >
                {renderedDom()}
            </Form.Item>
        );
    },
    (prevProps, nextProps) => {
        return isDeepEqualReact(nextProps, prevProps, ['onChange', 'onBlur']);
    },
);

SptField.displayName = 'SptField';

export default SptField;
