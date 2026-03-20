import { WarehouseSdk } from '@/services/WarehouseSdk';
import { ProFormSelect, ProFormSelectProps } from '@ant-design/pro-components';
import { ApiReturnType } from '@/api';
import React, { FC } from 'react';
import { SptComponentProvider } from '../Provider';

// 仓库类型
export enum WAREHOUSE_TYPE {
    Third = 1,
    Cloud = 2,
}

type StorageModel = ApiReturnType<typeof WarehouseSdk.storageList>[number];

export interface SptStoreSelectProps extends ProFormSelectProps {
    /**
     * 1 三方仓库， 2 云仓
     */
    storageType?: WAREHOUSE_TYPE;
    codeInLabel?: boolean;
    labelName?: keyof StorageModel | ((arg0: StorageModel) => string);
    valueName?: keyof StorageModel | ((arg0: StorageModel) => string);
    requestParams?: Parameters<typeof WarehouseSdk.storageList>[0];
    // filter?: (arg0: StorageModel) => StorageModel[];
}

/**
 * 仓库选择组件
 * @param param
 * @returns
 */
const SptStoreSelect: FC<SptStoreSelectProps> = ({
    storageType,
    fieldProps,
    debounceTime,
    codeInLabel = true,
    labelName = 'storageName',
    valueName = 'storageCode',
    requestParams,
    ...props
}) => {
    if (codeInLabel) {
        labelName = (record: StorageModel) => `${record?.storageName} (${record?.storageCode})`;
    }

    const formatLabel = (record: StorageModel) => {
        return typeof labelName === 'function' ? labelName(record) : record[labelName];
    };

    const formatValue = (record: StorageModel) => {
        return typeof valueName === 'function' ? valueName(record) : record[valueName];
    };

    return (
        <SptComponentProvider>
            <ProFormSelect
                fieldProps={{
                    ...fieldProps,
                    placeholder: fieldProps?.placeholder || '请输入',
                }}
                request={async ({ keyWords }) => {
                    const { data: res } = await WarehouseSdk.storageList({
                        storageType,
                        keyword: keyWords,
                        ...requestParams,
                    });
                    return res.data.map((item) => ({
                        label: formatLabel(item),
                        value: formatValue(item),
                    }));
                }}
                debounceTime={debounceTime ?? 500}
                noStyle={props.noStyle ?? true}
                showSearch={props.showSearch ?? true}
                allowClear={props.allowClear ?? true}
                {...props}
            />
        </SptComponentProvider>
    );
};
export default SptStoreSelect;
