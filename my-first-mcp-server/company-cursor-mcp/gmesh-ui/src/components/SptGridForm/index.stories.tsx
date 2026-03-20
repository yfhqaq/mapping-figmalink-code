import type { Meta, StoryObj } from '@storybook/react';
import SptGridForm, { SptGridFormItem } from ".";
import React from 'react';
import { TIME_DAY_FORMAT, tzTimeFormatter } from '@spotter/app-client-toolkit';
import { FieldData } from 'rc-field-form/es/interface';

const meta = {
    title: 'Components/表单/SptGridForm',
    component: SptGridForm,
    tags: ['autodocs'],
} satisfies Meta<typeof SptGridForm>;

export default meta;

type Story = StoryObj<typeof SptGridForm>;

export const BasicInfo: Story = {
    args: {
        formItems: [
            {
                label: '公司',
                name: 'companyName',
                readonly: true,
            },
            {
                label: '开始日期',
                name: 'startAtMs',
                render: (val: string) => tzTimeFormatter(val, TIME_DAY_FORMAT),
                readonly: true,
            },
            {
                label: '结束日期',
                name: 'endAtMs',
                render: (val: string) => tzTimeFormatter(val, TIME_DAY_FORMAT),
                readonly: true,
            },
        ] as SptGridFormItem[],
        fields: [
            {
                name: 'companyName',
                value: '宇宙中心'
            },
            {
                name: 'startAtMs',
                value: '1687924230785'
            },
            {
                name: 'endAtMs',
                value: '1687924248233'
            }
        ] as FieldData[],
        col: 3,
    },
    render: ({ formItems, fields, ...args }) => {
        return (
            <SptGridForm formItems={formItems} fields={fields} {...args} />
        )
    }
}


