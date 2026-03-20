import { ApiReturnType } from '@/api';
import { SptComponentProvider } from '@/components/Provider';
import { companySdk } from '@/services/CompanySdk';
import SelectBase, { SelectBaseProps } from '../SelectBase';
import React from 'react';
import { MakePartial } from '../types';

export type CompanyParamsType = Parameters<typeof companySdk.baseList>[0];
export type CompanyResponseType = ApiReturnType<typeof companySdk.baseList>[number];

/**
 * 供应商列表下拉组件-全量数据（不区分渠道站点）
 * @param param0
 * @returns
 */
function CompanySelect({
    labelName = (response: CompanyResponseType) => `${response.name} (${response.businessCode})`,
    valueName = (response: CompanyResponseType) => response.id,
    fieldProps = {},
    onLoaded = () => {},
    ...props
}: MakePartial<
    Omit<SelectBaseProps<CompanyParamsType, CompanyResponseType>, 'request'>,
    'labelName' | 'valueName'
> & { onLoaded?: (data: CompanyResponseType[]) => void }) {
    const customRequest = async (params: CompanyParamsType) => {
        try {
            const res = await companySdk.baseList(params);
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
            <SelectBase<CompanyParamsType, CompanyResponseType>
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

export default CompanySelect;
