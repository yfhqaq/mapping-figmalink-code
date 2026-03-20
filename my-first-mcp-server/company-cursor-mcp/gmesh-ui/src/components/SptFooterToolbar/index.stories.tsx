import type { Meta, StoryObj } from '@storybook/react';
import SptFooterToolbar from "."
import React from 'react';
import { Button } from 'antd';

const meta = {
    title: 'Components/布局/FooterToolbar',
    component: SptFooterToolbar,
    tags: ['autodocs']
} satisfies Meta<typeof SptFooterToolbar>;

export default meta;

type Story = StoryObj<typeof SptFooterToolbar>;

export const Default: Story = {
    name: '页面底部工具栏',
    args: {
        placeholder: true
    },
    render: ({ ...args }) => {
        return (
            <SptFooterToolbar {...args}>
                <Button>取消</Button>
                <Button type="primary">确认</Button>
            </SptFooterToolbar>
        )
    }
}

export const WithSpace: Story = {
    name: '自定义间距',
    args: {
        size: 'large',
        placeholder: true
    },
    render: ({ ...args }) => {
        return (
            <SptFooterToolbar {...args}>
                <Button>返回</Button>
                <Button>取消</Button>
                <Button type="primary">确认</Button>
            </SptFooterToolbar>
        )
    }
}

export const CustomStyle: Story = {
    name: '自定义样式',
    args: {
        style: {
            backgroundColor: '#f5f5f5',
            padding: '12px 24px'
        },
        placeholder: true
    },
    render: ({ ...args }) => {
        return (
            <SptFooterToolbar {...args}>
                <Button>取消</Button>
                <Button type="primary">保存</Button>
            </SptFooterToolbar>
        )
    }
}
