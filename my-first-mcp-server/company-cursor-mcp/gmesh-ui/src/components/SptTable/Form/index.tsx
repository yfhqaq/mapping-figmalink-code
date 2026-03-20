import { runFunction } from '@/utils/runFunction';
import {
    ActionType,
    ProFormColumnsType,
    ProTableProps,
    SubmitterProps,
    omitUndefined,
} from '@ant-design/pro-components';
import { Form, FormInstance, FormProps, Table, TablePaginationConfig } from 'antd';
import classNames from 'classnames';
import omit from 'omit.js';
import React, { FC, memo, useEffect, useMemo } from 'react';
import SptField from './Field';
import Submitter from './Submitter';
import transformKey from './transformKey';
import updateSearchParams from '@/utils/updateSearchParams';

interface FiledsColumnRenderProps {
    action: React.MutableRefObject<ActionType | undefined>;
    formRef: ProTableProps<any, any, any>['formRef'];
    type: ProTableProps<any, any, any>['type'];
    columns?: any[];
}

export interface SptFormProps extends FormProps {
    isKeyPressSubmit: boolean;
}

const FieldColumns: FC<FiledsColumnRenderProps> = ({ columns, action, type, formRef }) => {
    return (
        <>
            {columns?.map((item) => (
                <SptField
                    key={item.proFieldProps.proFieldKey}
                    item={item as ProFormColumnsType & { label: string }}
                    helpers={
                        {
                            action,
                            type,
                            originItem: item as ProFormColumnsType,
                            formRef: formRef!,
                        } as any
                    }
                />
            ))}
        </>
    );
};

const FiledsColumnRender = memo(FieldColumns);

type FilterProps<T, U> = {
    pagination?: TablePaginationConfig | false;
    beforeSearchSubmit?: (params: Partial<U>) => any;
    action: React.MutableRefObject<ActionType | undefined>;
    onSubmit?: (params: U) => void;
    onReset?: () => void;
    onFormSearchSubmit: (params: U) => void;
    loading: boolean;
    columns: ProTableProps<T, U, any>['columns'];
    formRef: ProTableProps<T, U, any>['formRef'];
    form?: SptFormProps;
    search: ProTableProps<T, U, any>['search'];
    manualRequest: ProTableProps<T, U, any>['manualRequest'];
    type: ProTableProps<T, U, any>['type'];
    searchKeyMap: Record<string, any>;
    submitter?:
        | SubmitterProps<{
              form?: FormInstance<any>;
          }>
        | false;
    resetTableSearchParams?: boolean;
};

function Filter<T, U>({
    action,
    formRef,
    beforeSearchSubmit = (searchParams: Partial<U>) => searchParams,
    manualRequest,
    onSubmit,
    onReset,
    onFormSearchSubmit,
    columns,
    type,
    loading,
    form,
    searchKeyMap,
    search: searchConfig,
    resetTableSearchParams = true,
}: FilterProps<T, U>) {
    const baseClassName = 'spt-table-search';
    const [innerForm] = Form.useForm(searchConfig ? searchConfig.form : undefined);

    if (!formRef?.current) {
        formRef!.current = innerForm as any;
    }

    const submit = (params: T, firstLoad: boolean) => {
        const pagination = action?.current?.pageInfo;
        // 只传入 pagination 中的 current 和 pageSize 参数
        const pageInfo = pagination
            ? omitUndefined({
                  current: pagination.current,
                  pageSize: pagination.pageSize,
              })
            : {};
        const submitParams = {
            ...params,
            _timestamp: Date.now(),
            ...pageInfo,
        };
        const omitParams = omit(beforeSearchSubmit(submitParams as U), Object.keys(pageInfo!)) as U;
        onFormSearchSubmit(omitParams);

        if (onSubmit && !firstLoad) {
            onSubmit?.(params as unknown as U);
        }
    };

    const reset = (value: Partial<T>) => {
        const pagination = action?.current?.pageInfo;
        const pageInfo = pagination
            ? omitUndefined({
                  current: pagination.current,
                  pageSize: pagination.pageSize,
              })
            : {};

        const omitParams = omit(
            beforeSearchSubmit({ ...value, ...pageInfo } as unknown as U),
            Object.keys(pageInfo!),
        ) as U;
        onFormSearchSubmit(omitParams);
        // back first page
        action?.current?.setPageInfo?.({
            current: 1,
        });
        if (resetTableSearchParams) {
            /** 重置时清除 url 的 table_search_params */
            updateSearchParams({ table_search_params: undefined }, window.location.href);
        }
        onReset?.();
    };

    const columnsList = useMemo(() => {
        return columns
            ?.filter((item) => {
                if (item === Table.EXPAND_COLUMN || item === Table.SELECTION_COLUMN) {
                    return false;
                }
                if (item.hideInSearch || item.search === false) {
                    return false;
                }
                if (type === 'form' && item.hideInForm) {
                    return false;
                }
                // 不处理特殊的valueType
                if (
                    item.valueType &&
                    typeof item.valueType === 'string' &&
                    ['index', 'indexBorder', 'option'].includes(item?.valueType)
                ) {
                    return false;
                }

                return true;
            })
            ?.sort((a, b) => {
                if (b.order || a.order) {
                    return (b.order || 0) - (a.order || 0);
                }
                return (b.index || 0) - (a.index || 0);
            })
            ?.map((item) => {
                const finalValueType =
                    !item.valueType ||
                    (['textarea', 'jsonCode', 'code'].includes(item?.valueType as string) &&
                        type === 'table')
                        ? 'text'
                        : item?.valueType;
                const columnKey = item?.key || item?.dataIndex?.toString();
                const title = runFunction(item.title, item, 'form');

                return {
                    ...item,
                    title,
                    label: title,
                    width: undefined,
                    ...(item?.search ? (item.search as any) : {}),
                    valueType: finalValueType,
                    proFieldProps: {
                        ...item.proFieldProps,
                        proFieldKey: columnKey ? `table-field-${columnKey}` : undefined,
                    },
                    getFieldProps: item.fieldProps
                        ? () => runFunction(item.fieldProps, formRef?.current, item)
                        : undefined,
                    getFormItemProps: item.formItemProps
                        ? () => runFunction(item.formItemProps, formRef?.current, item)
                        : undefined,
                };
            });
    }, [columns, type]);

    useEffect(() => {
        const finalValues = transformKey(innerForm?.getFieldsValue() ?? {}, searchKeyMap);
        const pageInfo = action?.current?.pageInfo;
        const { current = pageInfo?.current, pageSize = pageInfo?.pageSize } = finalValues as any;
        action?.current?.setPageInfo?.({
            ...pageInfo,
            current: parseInt(current, 10),
            pageSize: parseInt(pageSize, 10),
        });

        /** 手动模式不进行初始提交 */
        if (manualRequest) return;
        submit(finalValues, true);
    }, []);

    // useImperativeHandle(formRef, () => {
    //     return {
    //         ...innerForm,
    //         submit: async () => {
    //             if (loading) return;
    //             await innerForm.validateFields();
    //             const values = innerForm.getFieldsValue();
    //             submit(transformKey(values, searchKeyMap) as T, false);
    //         },
    //     };
    // }, [innerForm]);

    return (
        <div className={classNames(baseClassName)}>
            <Form<T>
                layout="horizontal"
                autoComplete="off"
                {...(form || {})}
                {...omit({ ...searchConfig }, ['filterType'])}
                onKeyPress={(event) => {
                    if (event.key === 'Enter' && form?.isKeyPressSubmit !== false) {
                        formRef?.current?.submit();
                    }
                }}
                form={innerForm}
                className={`${baseClassName}-form`}
                initialValues={form?.initialValues}
                onFinish={(values) => {
                    if (loading) return;
                    submit(transformKey(values as any, searchKeyMap) as T, false);
                }}
            >
                <div className={`${baseClassName}-cols`}>
                    <FiledsColumnRender
                        columns={columnsList}
                        action={action}
                        type={type}
                        formRef={formRef}
                    />
                    <div className={`${baseClassName}-submitter-wrap`}>
                        <Submitter
                            submit={async () => {
                                if (loading) return;
                                await innerForm.validateFields();
                                const values = innerForm.getFieldsValue();
                                submit(transformKey(values, searchKeyMap) as T, false);
                            }}
                            reset={async () => {
                                if (loading) return;
                                innerForm.resetFields();
                                const values = innerForm.getFieldsValue();
                                reset(transformKey(values, searchKeyMap) as T);
                            }}
                            submitButtonProps={{
                                loading,
                            }}
                        />
                    </div>
                </div>
            </Form>
        </div>
    );
}

export default memo(Filter);
