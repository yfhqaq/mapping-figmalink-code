import { Meta, StoryObj } from '@storybook/react';
import SptTransfer from '.';
import React from 'react';

const meta = {
    title: 'Components/数据录入/SptTransfer',
    component: SptTransfer
} satisfies Meta<typeof SptTransfer>;

export default meta;

type Story = StoryObj<typeof SptTransfer>;

export const Transfer: Story = {
    name: 'Spt穿梭框例子',
    args: {
        options: [
            {
                label: 'ASDIOJD0210201021231',
                value: '123'
            },
            {
                label: 'ASDIOJD0210201022123',
                value: 'kkjsd'
            },
            {
                label: 'ASDIOJD02102010221443',
                value: '999'
            },
        ],
    },
    render: ({ ... args }) => {
        return (
            <div style={{ height: 300 }}>
                <SptTransfer {...args} />
            </div>
        )
    }
}
