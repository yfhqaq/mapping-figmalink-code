import { WarehouseSdk } from '@/services/WarehouseSdk';
import { ApiReturnType } from '@/api';
import { SptComponentProvider } from '@/components/Provider';
import SelectBase, { SelectBaseProps } from '../SelectBase';
import React from 'react';
import { MakePartial } from '../types';

export type StoreParamsType = Parameters<typeof WarehouseSdk.storageList>[0];
export type StoreResponseType = ApiReturnType<typeof WarehouseSdk.storageList>[number];

/**
 * 仓库下拉选择组件
 * @param param0
 * @returns
 */
function StoreSelect({
    labelName = (response) => `${response.storageName} (${response.storageCode})`,
    valueName = (response) => response.storageCode,
    ...props
}: MakePartial<
    Omit<SelectBaseProps<StoreParamsType, StoreResponseType>, 'request'>,
    'labelName' | 'valueName'
>) {
    const customRequest = async (params: StoreParamsType) => {
        try {
            const res = await WarehouseSdk.storageList(params);
            return res?.data?.data ?? [];
        } catch (error) {
            console.error(error);
        }
        return [];
    };

    return (
        <SptComponentProvider>
            <SelectBase<StoreParamsType, StoreResponseType>
                labelName={labelName}
                valueName={valueName}
                request={customRequest}
                {...props}
            />
        </SptComponentProvider>
    );
}

export default StoreSelect;
