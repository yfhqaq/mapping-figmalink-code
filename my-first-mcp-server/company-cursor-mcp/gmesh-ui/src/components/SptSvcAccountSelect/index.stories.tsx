import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import SptSvcAccountSelect from '.';
import { withProxy } from '@/decorators/withGmesh';

const meta = {
    title: 'components/数据录入/SptSvcAccountSelect',
    component: SptSvcAccountSelect,
    decorators: [withProxy],
    tags: ['autodocs'],
} satisfies Meta<typeof SptSvcAccountSelect>;

export default meta;

type Story = StoryObj<typeof SptSvcAccountSelect>;

export const Default: Story = {
    name: '默认样式',
    args: {
        style: {
            width: 500
        },
    },
    render: ({ ...args }) => {

        return (
            <SptSvcAccountSelect {...args} />
        )
    }
}