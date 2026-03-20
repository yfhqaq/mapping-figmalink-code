import React from 'react';
import { ProFormSelect, ProFormSelectProps } from '@ant-design/pro-components';
import { ApiReturnType } from '@/api';
import { companySdk } from '../../services/CompanySdk';
import { SptComponentProvider } from '../Provider';

type CompanyListType = ApiReturnType<typeof companySdk.baseList>;

export type SptCompanySelectProps = ProFormSelectProps & {
    // value 所取字段，默认为id，可自定义为其他公司接口的字段
    valueField?: keyof ApiReturnType<typeof companySdk.baseList>[number];
    // 过滤函数，用于过滤公司中符合要求的数据
    filter?: (data: ApiReturnType<typeof companySdk.baseList>[number]) => boolean;
    onLoaded?: (val: CompanyListType) => void;
};

/**
 * 全量请求公司做模糊查询
 * @deprecated 请使用 SptEntitySelect.Company
 */
const SptCompanySelect = ({
    noStyle = true,
    allowClear = true,
    showSearch = true,
    fieldProps,
    filter,
    debounceTime,
    valueField = 'id',
    onLoaded,
    ...props
}: SptCompanySelectProps) => {
    return (
        <SptComponentProvider>
            <ProFormSelect
                noStyle={noStyle}
                allowClear={allowClear}
                fieldProps={{ ...fieldProps }}
                request={async ({ keyWords }) => {
                    const { data: res } = await companySdk.baseList({
                        keyword: keyWords,
                    });
                    onLoaded?.(res.data);
                    return (filter ? res.data.filter((item) => filter(item)) : res.data).map(
                        (e) => ({
                            label: `${e.name} (${e.businessCode})`,
                            value: e[valueField],
                        }),
                    );
                }}
                debounceTime={debounceTime ?? 500}
                placeholder="请输入"
                showSearch={showSearch}
                {...props}
            />
        </SptComponentProvider>
    );
};

export default SptCompanySelect;
