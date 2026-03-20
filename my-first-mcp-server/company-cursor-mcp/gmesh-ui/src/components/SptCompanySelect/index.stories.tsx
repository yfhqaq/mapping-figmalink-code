import type { Meta, StoryObj } from '@storybook/react';
import SptCompanySelect from '.';
import React from 'react';
import { within, userEvent }  from '@storybook/testing-library';
import { ProColumns, ProForm, ProFormText, ProTable } from '@ant-design/pro-components';
import { SptComponentProvider } from '../Provider';
import { withProxy } from '@/decorators/withGmesh';

//👇 This default export determines where your story goes in the story list
const meta = {
    title: 'Components/数据录入/SptCompanySelect',
    component: SptCompanySelect,
    decorators: [withProxy],
    tags: ['autodocs'],
    parameters: {
        netHijack: {
            xApp: 'gmesh',
        },
    },
} satisfies Meta<typeof SptCompanySelect>;

export default meta;

type Story = StoryObj<typeof SptCompanySelect>;

export const Default: Story = {
    args: {
        style: {
            width: 500
        }
    }
};

export const ProFormDemo = () => {
    return (
        <ProForm style={{ width: '400px' }}>
            <SptCompanySelect
                name="companyCode"
                label="公司"
                valueField="businessCode"
                noStyle={false}
            />
            <ProFormText label="备注" name="remark" />
        </ProForm>
    );
};


export const ProTableDemo: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await userEvent.click(canvas.getByLabelText("公司"))
        await userEvent.type(canvas.getByLabelText("公司"), '宇宙中心')
    },
    render: () => {
        const columns: ProColumns<any>[] = [
            {
                dataIndex: 'id',
                title: 'ID',
                width: 80,
            },
            {
                dataIndex: 'company',
                title: '公司',
                renderFormItem: () => <SptCompanySelect />,
            }
        ];
    
        const dataSource = [
            {
                id: '12',
                company: '宇宙中心'
            }
        ];

        return (
            <SptComponentProvider>
                <ProTable columns={columns} dataSource={dataSource} />
            </SptComponentProvider>
        )
    }
}