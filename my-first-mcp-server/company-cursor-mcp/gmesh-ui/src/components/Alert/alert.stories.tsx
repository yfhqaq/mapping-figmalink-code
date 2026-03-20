import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import SptAlert from './index';
import { InfoCircleOutlined } from '@ant-design/icons';

const meta = {
    title: 'Components/反馈/SptAlert',
    component: SptAlert,
    tags: ['autodocs'],
    argTypes: {
        type: {
            description: '警告提示的类型',
            control: 'select',
            options: ['success', 'info', 'warning', 'error'],
        },
        message: {
            description: '警告提示的标题',
            control: 'text',
        },
        description: {
            description: '警告提示的详细描述',
            control: 'text',
        },
        showIcon: {
            description: '是否显示图标',
            control: 'boolean',
        },
        closable: {
            description: '是否可关闭',
            control: 'boolean',
        },
        banner: {
            description: '是否用作顶部通告',
            control: 'boolean',
        },
    }
} satisfies Meta<typeof SptAlert>;

export default meta;

type Story = StoryObj<typeof SptAlert>;

// 基础用法
export const Default: Story = {
    args: {
        message: '这是一个信息提示',
        type: 'info',
        showIcon: true,
    },
};

// 不同类型
export const Types: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SptAlert message="成功提示" type="success" showIcon />
            <SptAlert message="信息提示" type="info" showIcon />
            <SptAlert message="警告提示" type="warning" showIcon />
            <SptAlert message="错误提示" type="error" showIcon />
        </div>
    ),
};

// 带有描述
export const WithDescription: Story = {
    args: {
        message: '带有详细描述的提示',
        description: '这是一段详细的描述文本，用于解释当前提示的更多信息。可以包含多行文本内容。',
        type: 'info',
        showIcon: true,
    },
};

// 可关闭的警告
export const Closable: Story = {
    args: {
        message: '可关闭的警告提示',
        description: '点击右上角的关闭按钮可以关闭此警告提示。',
        type: 'warning',
        showIcon: true,
        closable: true,
    },
};

// 无图标
export const WithoutIcon: Story = {
    args: {
        message: '无图标警告提示',
        description: '这是一个没有图标的警告提示示例。',
        type: 'info',
        showIcon: false,
    },
};

// 顶部通告
export const Banner: Story = {
    args: {
        message: '这是一条顶部通告',
        banner: true,
    },
};

// 自定义操作
export const WithAction: Story = {
    args: {
        message: '带有操作按钮的提示',
        description: '这个提示包含了一个自定义的操作按钮。',
        type: 'info',
        showIcon: true,
        action: (
            <a href="#" onClick={(e) => { e.preventDefault(); alert('操作被点击'); }}>
                查看详情
            </a>
        ),
    },
};

// 自定义图标
export const CustomIcon: Story = {
    args: {
        message: '自定义图标',
        description: '这个提示使用了自定义的图标。',
        icon: <InfoCircleOutlined style={{ color: '#1677ff' }} />,
        type: 'info',
    },
};

// 组合场景示例
export const CombinedScenario: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <SptAlert 
                message="系统通知" 
                description="您的账户将于7天后到期，请及时续费以避免服务中断。" 
                type="warning" 
                showIcon 
                closable 
                action={
                    <a href="#" onClick={(e) => { e.preventDefault(); }}>立即续费</a>
                }
            />
            <SptAlert 
                message="操作成功" 
                description="您的配置已成功保存，新的设置将在下次系统启动时生效。" 
                type="success" 
                showIcon 
            />
            <SptAlert 
                banner
                message="系统将于今晚22:00-23:00进行例行维护，请提前保存您的工作。" 
                type="info" 
                showIcon 
                closable
            />
        </div>
    ),
};


// 长文本消息示例
export const LongMessage: Story = {
    args: {
        message: '这是一个非常长的消息标题，用于测试当消息内容过长时的显示效果。这种情况可能出现在需要展示较为详细的提示信息时，系统会自动处理长文本的换行和布局，确保用户体验良好。',
        type: 'info',
        showIcon: true,
        closable: true,
    },
};

// 长文本消息和描述示例
export const LongMessageAndDescription: Story = {
    args: {
        message: '这是一个非常长的消息标题，用于测试当消息内容过长时的显示效果',
        description: '这是一段更加详细的描述文本，当需要向用户提供更多信息时使用。这里可以包含多行文本内容，系统会自动处理文本的换行和布局。在实际应用中，可能会包含操作指南、错误详情或其他需要用户了解的重要信息。',
        type: 'warning',
        showIcon: true,
        closable: true,
    },
};
