import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import SptStoreSelect from '.';
import { withProxy } from '@/decorators/withGmesh';

const meta: Meta<typeof SptStoreSelect> = {
    title: 'Components/数据录入/SptStoreSelect',
    component: SptStoreSelect,
    decorators: [withProxy],
    tags: ['autodocs'],
    parameters: {
        netHijack: {
            xApp: 'gmesh',
        },
    },
};

export default meta;

type Story = StoryObj<typeof SptStoreSelect>;

export const FormSelect: Story = {
    // name: '仓库选择',
    args: {
        style: {
            width: 500,
        },
    },
    render: ({ ...args }) => {

        return (
            <SptStoreSelect {...args} />
        )
    }
}