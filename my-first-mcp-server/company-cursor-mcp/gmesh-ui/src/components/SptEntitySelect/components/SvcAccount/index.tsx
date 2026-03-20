import { ApiReturnType } from '@/api';
import { SptComponentProvider } from '@/components/Provider';
import SelectBase, { SelectBaseProps } from '../SelectBase';
import React from 'react';
import { SptAccountSdk } from '@/services/SptAccountSdk';
import { MakePartial } from '../types';

export type SvcAccountParamsType = undefined;
export type SvcAccountResponseType = ApiReturnType<typeof SptAccountSdk.all>[number];

/**
 * Svc 账号列表下拉组件
 * @param param0
 * @returns
 */
function SvcAccount({
    labelName = (response: SvcAccountResponseType) => response.registeredBusinessName,
    valueName = (response: SvcAccountResponseType) => response.accountCode,
    ...props
}: MakePartial<
    Omit<SelectBaseProps<SvcAccountParamsType, SvcAccountResponseType>, 'request'>,
    'labelName' | 'valueName'
>) {
    const customRequest = async (params: SvcAccountParamsType) => {
        try {
            const res = await SptAccountSdk.all(params);
            return res?.data?.data ?? [];
        } catch (error) {
            console.error(error);
        }
        return [];
    };

    return (
        <SptComponentProvider>
            <SelectBase<SvcAccountParamsType, SvcAccountResponseType>
                labelName={labelName}
                valueName={valueName}
                request={customRequest}
                {...props}
            />
        </SptComponentProvider>
    );
}

export default SvcAccount;
