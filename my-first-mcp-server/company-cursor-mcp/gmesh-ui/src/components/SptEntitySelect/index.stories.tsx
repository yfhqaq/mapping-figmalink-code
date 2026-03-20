import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import SptEntitySelect from '.';
import { withProxy } from '@/decorators/withGmesh';

//👇 This default export determines where your story goes in the story list
const meta = {
    title: 'Components/数据录入/SptEntitySelect',
    component: SptEntitySelect,
    decorators: [withProxy],
    tags: ['autodocs'],
    parameters: {
        netHijack: {
            xApp: 'gmesh',
        },
    },
} satisfies Meta<typeof SptEntitySelect>;

export default meta;

type Story = StoryObj<typeof SptEntitySelect>;

/**
 * 下拉组件轻量模式
 */
export const Light: Story = {
    args: {
        label: '供应商',
        businessType: 'company',
        viewMode: 'light'
    }
};

/**
 * 业务组件 - 供应商下拉组件（所有公司）
 */
export const Company: Story = {
    args: {
        label: '供应商',
        businessType: 'company',
    }
};

/**
 * 业务组件 - 仓库下拉组件（所有仓库）
 */
export const Store: Story = {
    args: {
        label: '仓库',
        businessType: 'store'
    }
};

/**
 * 业务组件 - SVC 账号下拉组件，提供 SVC 账号列表
 */
export const SvcAccount: Story = {
    args: {
        label: 'SVC 账号列表',
        businessType: 'svcAccount',
    }
};

/**
 * 业务组件 - VendorCode 下拉列表
 */
export const VendorCode: Story = {
    args: {
        label: 'VendorCode 下拉列表',
        businessType: 'vendorCode',
    }
};

/**
 * Params 示例
 * 
 * 可以通过 params 传递额外的参数，比如公司下拉组件，可以通过 params 传递 companyType 参数，来区分公司类型
 */
export const Params: Story = {
    args: {
        ...Company.args,
        params: {
            isPartyA: 1,
        }
    }
};

/**
 * 自定义labelName - 字面量
 */
export const LabelName: Story = {
    render: () => {
        return (
            <SptEntitySelect.Company
                label="供应商"
                labelName='name'
            />
        )
    }
}

/**
 * 自定义labelName - 函数
 */
export const LabelNameFunction: Story = {
    render: () => {
        return (
            <SptEntitySelect.Company
                label="供应商"
                labelName={(values) => {

                    return `${values.businessCode} (${values.id})`
                }}
            />
        )
    }
}


/**
 * 自定义Value - 字面量
 */
export const ValueName: Story = {
    render: () => {
        const [val, setVal] = useState('');
        const [val2, setVal2] = useState('');
        const [val3, setVal3] = useState('');

        return (
            <div>
                <div>
                    <div style={{ marginBottom: '16px' }}>
                        自定义值1 (businessCode):  {val}
                    </div>

                    <SptEntitySelect.Company
                        label="供应商"
                        valueName='businessCode'
                        onChange={(val) => {
                            setVal(val);
                        }}
                    />
                </div>
                <div>
                    <div style={{ marginBottom: '16px' }}>
                        自定义值2 (id):  {val2}
                    </div>

                    <SptEntitySelect.Company
                        label="供应商"
                        valueName='id'
                        onChange={(val) => {
                            setVal2(val);
                        }}
                    />
                </div>
                <div>
                    <div style={{ marginBottom: '16px' }}>
                        自定义值3 (businessCode+name):  {val3}
                    </div>

                    <SptEntitySelect.Company
                        label="供应商"
                        valueName={(values) => {
                            // return `${values.businessCode}-${values.name}`
                            return JSON.stringify({
                                businessCode: values.businessCode,
                                name: values.name
                            })
                        }}
                        onChange={(val) => {
                            setVal3(val);
                        }}
                    />
                </div>
            </div>
        )
    }
}

/**
 * 自定义Value - 函数
 */
export const ValueNameFunction: Story = {
    render: () => {
        return (
            <SptEntitySelect.Company
                label="供应商"
                valueName='businessCode'
            />
        )
    }
}



/**
 * 格式化返回数据 - 如 filter
 */
export const FormatResponseData: Story = {
    render: () => {
        return (
            <SptEntitySelect.Company
                label="供应商"
                valueName='businessCode'
                format={(data) => {
                    return data.filter((item) => item.businessCode === '1001')
                }}
            />
        )
    }
}
