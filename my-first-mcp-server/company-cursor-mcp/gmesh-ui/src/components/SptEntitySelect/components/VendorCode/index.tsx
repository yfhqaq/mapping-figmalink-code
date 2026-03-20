import { ApiPaginationReturnType } from '@/api';
import { SptComponentProvider } from '@/components/Provider';
import SelectBase, { SelectBaseProps } from '../SelectBase';
import React from 'react';
import { MakePartial } from '../types';
import { spotterVendorSdk } from '@/services/VendorCode';

export type VendorCodeParamsType = Parameters<typeof spotterVendorSdk.page>[0];
export type VendorCodeResponseType = ApiPaginationReturnType<typeof spotterVendorSdk.page>;

/**
 * VendorCode 列表下拉组件
 * @param param0
 * @returns
 */
function VendorCode({
    labelName = (response: VendorCodeResponseType) => response.vendorCode,
    valueName = (response: VendorCodeResponseType) => response.vendorCode,
    ...props
}: MakePartial<
    Omit<SelectBaseProps<VendorCodeParamsType, VendorCodeResponseType>, 'request'>,
    'labelName' | 'valueName'
>) {
    const customRequest = async (
        params: MakePartial<VendorCodeParamsType, 'currentPage' | 'pageSize'>,
    ) => {
        try {
            const res = await spotterVendorSdk.page({
                currentPage: 1,
                pageSize: 999,
                ...params,
            });
            return res.data?.data?.data ?? [];
        } catch (error) {
            console.error(error);
        }
        return [];
    };

    return (
        <SptComponentProvider>
            <SelectBase<
                MakePartial<VendorCodeParamsType, 'currentPage' | 'pageSize'>,
                VendorCodeResponseType
            >
                labelName={labelName}
                valueName={valueName}
                request={customRequest}
                debounceTime={500}
                {...props}
            />
        </SptComponentProvider>
    );
}

export default VendorCode;
