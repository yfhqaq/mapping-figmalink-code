import type { Meta, StoryObj } from '@storybook/react';
import SptRestModal from "."
import React from 'react';
import { Button } from 'antd';

const meta = {
    title: 'Components/反馈/SptRestModal',
    component: SptRestModal,
    tags: ['autodocs']
} satisfies Meta<typeof SptRestModal>;

export default meta;

type Story = StoryObj<typeof SptRestModal>;

export const Default: Story = {
    args: {
        options: [
            '1231231',
            '123123123',
            '123125523w4',
            '9900980',
            '997768768'
        ],
        title: 'ASIN 列表'
    },
    render: ({ ...args }) => {
        return (
            <SptRestModal trigger={<Button>打开</Button>} {...args} />
        )
    }
}
