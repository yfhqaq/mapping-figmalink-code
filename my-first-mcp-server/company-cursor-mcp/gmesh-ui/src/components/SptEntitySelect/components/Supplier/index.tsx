import { ApiReturnType } from '@/api';
import { SptComponentProvider } from '@/components/Provider';
import { companySdk } from '@/services/CompanySdk';
import SelectBase, { SelectBaseProps } from '../SelectBase';
import React from 'react';
import { MakePartial } from '../types';

export type SupplierParamsType = Parameters<typeof companySdk.list>[0];
export type SupplierResponseType = ApiReturnType<typeof companySdk.list>[number];

/**
 * 供应商列表下拉组件-区分渠道站点
 * @param param0
 * @returns
 */
function SupplierSelect({
    labelName = (response: SupplierResponseType) => `${response.name} (${response.businessCode})`,
    valueName = (response: SupplierResponseType) => response.id,
    fieldProps = {},
    onLoaded = () => {},
    ...props
}: MakePartial<
    Omit<SelectBaseProps<SupplierParamsType, SupplierResponseType>, 'request'>,
    'labelName' | 'valueName'
> & { onLoaded?: (data: SupplierResponseType[]) => void }) {
    const customRequest = async (params: SupplierParamsType) => {
        try {
            const res = await companySdk.list(params);
            const result = res?.data?.data || [];
            onLoaded?.(result);
            return result;
        } catch (error) {
            console.error(error);
        }
        return [];
    };

    return (
        <SptComponentProvider>
            <SelectBase<SupplierParamsType, SupplierResponseType>
                labelName={labelName}
                valueName={valueName}
                request={customRequest}
                fieldProps={{
                    fetchDataOnSearch: false,
                    ...fieldProps,
                }}
                {...props}
            />
        </SptComponentProvider>
    );
}

export default SupplierSelect;
