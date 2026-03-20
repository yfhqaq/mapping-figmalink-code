import { Meta, StoryObj } from '@storybook/react';
import SptSelect from '.';
import React from 'react';
import { ProForm, ProFormItem } from '@ant-design/pro-components';

const meta = {
    title: 'Components/数据录入/SptSelect',
    component: SptSelect,
    tags: ['autodocs']
} satisfies Meta<typeof SptSelect>;

export default meta;

type Story = StoryObj<typeof SptSelect>;

export const Select: Story = {
    args: {
        options: [
            {
                label: '公司1',
                value: '公司1',
                key: '1'
            },
            {
                label: '公司2',
                value: '公司2',
                key: '2'
            },
            {
                label: '公司3',
                value: '公司3',
                key: '3'
            },
            {
                label: '公司4',
                value: '公司4',
                key: '4'
            }
        ]
    },
    render: ({ ...args }) => (
        <ProForm>
            <ProFormItem label="公司" name="company">
                <SptSelect title="公司选择" {...args} />
            </ProFormItem>
        </ProForm>
    )
};
