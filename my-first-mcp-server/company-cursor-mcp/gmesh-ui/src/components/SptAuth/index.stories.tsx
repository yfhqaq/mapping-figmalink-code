import { Meta, StoryObj } from '@storybook/react';
import SptAuth from '.';
import React from 'react';
import { Button } from 'antd';

const meta = {
    title: 'Components/通用/SptAuth',
    component: SptAuth,
    tags: ['autodocs']
} satisfies Meta<typeof SptAuth>;

export default meta;

type Story = StoryObj<typeof SptAuth>;

export const Default: Story = {
    args: {
        code: 'test',
        fallback: <span>无权限时显示的自定义内容</span>,
        children: <Button>详情</Button>
    },
    render: ({ ...args }) => {
        return (
            <SptAuth {...args}>{args.children}</SptAuth>
        )
    }
};

