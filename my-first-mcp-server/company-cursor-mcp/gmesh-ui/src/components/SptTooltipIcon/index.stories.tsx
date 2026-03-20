import { Meta, StoryObj } from "@storybook/react";
import SptTooltipIcon from ".";
import { InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React from 'react';

const meta = {
    title: 'Components/图标/SptTooltipIcon',
    component: SptTooltipIcon,
    tags: ['autodocs'],
    argTypes: {
        tooltip: {
            description: '提示文本内容',
            control: 'text',
            table: {
                type: { summary: 'ReactNode' },
                defaultValue: { summary: '-' },
            },
        },
        icon: {
            description: '自定义图标',
            control: false,
            table: {
                type: { summary: 'ReactNode' },
                defaultValue: { summary: '<QuestionCircleOutlined />' },
            },
        },
        size: {
            description: '图标大小',
            control: { type: 'number', min: 12, max: 32 },
            table: {
                type: { summary: 'number' },
                defaultValue: { summary: 14 },
            },
        },
        color: {
            description: '图标颜色',
            control: 'color',
            table: {
                type: { summary: 'string' },
                defaultValue: { summary: 'rgba(0, 0, 0, 0.45)' },
            },
        },
        placement: {
            description: 'Tooltip 的显示位置',
            control: 'select',
            options: ['top', 'left', 'right', 'bottom'],
            table: {
                type: { summary: 'top | left | right | bottom' },
                defaultValue: { summary: 'top' },
            },
        },
        onClick: {
            description: '点击图标时的回调函数',
            control: false,
            table: {
                type: { summary: '(e: React.MouseEvent) => void' },
                defaultValue: { summary: '-' },
            },
        },
    },
} satisfies Meta<typeof SptTooltipIcon>;

export default meta;
type Story = StoryObj<typeof SptTooltipIcon>;

/**
 * 最基础的用法，展示带有问号图标的提示。
 */
export const Basic: Story = {
    args: {
        tooltip: '这是一个基础的提示文本',
    },
};

/**
 * 可以自定义图标的样式，包括大小、颜色等。
 */
export const CustomStyle: Story = {
    args: {
        tooltip: '自定义样式的提示图标',
        size: 18,
        color: '#1890ff',
        spacing: 8,
    },
};

/**
 * 使用不同的图标替换默认的问号图标。
 */
export const CustomIcon: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '24px' }}>
            <SptTooltipIcon 
                tooltip="信息提示" 
                icon={<InfoCircleOutlined />}
                color="#1890ff"
            />
            <SptTooltipIcon 
                tooltip="警告提示" 
                icon={<ExclamationCircleOutlined />}
                color="#faad14"
            />
        </div>
    ),
};

/**
 * Tooltip 可以显示在不同的位置。
 */
export const TooltipPlacements: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '24px', padding: '20px' }}>
            <SptTooltipIcon 
                tooltip="顶部提示" 
                placement="top"
            />
            <SptTooltipIcon 
                tooltip="左侧提示" 
                placement="left"
            />
            <SptTooltipIcon 
                tooltip="右侧提示" 
                placement="right"
            />
            <SptTooltipIcon 
                tooltip="底部提示" 
                placement="bottom"
            />
        </div>
    ),
};

/**
 * 图标支持点击交互。
 */
export const Clickable: Story = {
    args: {
        tooltip: '点击查看更多信息',
        onClick: () => alert('图标被点击了！'),
    },
};

/**
 * 在实际应用场景中的使用示例。
 */
export const InContext: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
                用户名 
                <SptTooltipIcon 
                    tooltip="用户名需要包含3-20个字符"
                    color="#1890ff"
                />
            </div>
            <div>
                密码强度 
                <SptTooltipIcon 
                    tooltip={
                        <div>
                            密码必须包含：
                            <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                                <li>至少8个字符</li>
                                <li>至少1个大写字母</li>
                                <li>至少1个特殊字符</li>
                            </ul>
                        </div>
                    }
                    icon={<InfoCircleOutlined />}
                />
            </div>
        </div>
    ),
};