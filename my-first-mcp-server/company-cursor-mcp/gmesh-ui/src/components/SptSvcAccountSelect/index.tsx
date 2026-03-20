import { ApiReturnType } from '@/api';
import { ProFormSelect, ProFormSelectProps } from '@ant-design/pro-components';
import React from 'react';
import { SptAccountSdk } from '@/services/SptAccountSdk';
import { SptComponentProvider } from '../Provider';

export type SptSvcAccountSelectProps = ProFormSelectProps & {
    labelName?: keyof ApiReturnType<typeof SptAccountSdk.all>[number];
    valueName?: keyof ApiReturnType<typeof SptAccountSdk.all>[number];
    filter?: (data: ApiReturnType<typeof SptAccountSdk.all>[number]) => boolean;
};

const SvcAccountSelectBase: React.FC<SptSvcAccountSelectProps> = ({
    noStyle = true,
    allowClear = true,
    showSearch = true,
    fieldProps,
    debounceTime,
    labelName = 'registeredBusinessName',
    valueName = 'accountCode',
    ...props
}) => {
    return (
        <ProFormSelect
            {...{
                ...props,
                noStyle,
                allowClear,
                fieldProps: { ...fieldProps },
                request: async () => {
                    const { data: res } = await SptAccountSdk.all();

                    return res.data?.map((account) => ({
                        label: account[labelName],
                        value: account[valueName],
                    }));
                },
                debounceTime: debounceTime ?? 500,
                placeholder: '请输入',
                showSearch,
            }}
        />
    );
};

/**
 * SVC账号选择下拉封装
 */
const SptSvcAccountSelect: React.FC<SptSvcAccountSelectProps> = ({ ...props }) => {
    return (
        <SptComponentProvider>
            <SvcAccountSelectBase {...props} />
        </SptComponentProvider>
    );
};

export default SptSvcAccountSelect;
