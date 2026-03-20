import type { Meta, StoryObj } from '@storybook/react';
import React, { FC, useState } from 'react';
import SptTabs, { SptTabBadgeType } from '.';

const meta = {
    title: 'Components/导航/Tabs',
    component: SptTabs,
    tags: ['autodocs'],
    parameters: {
        netHijack: {
            xApp: 'gmesh',
        },
        docs: {
            description: {
                component: `
SptTabs 是一个基于 Antd Tabs 封装的带徽标的标签页组件。

### 特性
- 支持两种徽标展示方式：行内(Inline)和角标(Corner)
- 完全继承 Antd Tabs 的所有属性
- 支持自定义徽标样式
- 支持标签页内容的动态销毁

### 参数说明
- \`items\`: 标签页配置数组，每项包含：
  - \`key\`: 唯一标识
  - \`label\`: 标签文本或节点
  - \`children\`: 标签页内容
  - \`count\`: 徽标数值
- \`badgeType\`: 徽标类型，支持 Inline 和 Corner
- \`badgeProps\`: 徽标属性，可传入 Antd Badge 的所有属性
- \`destroyInactiveTabPane\`: 是否销毁未激活的标签页内容
`,
            }
        }
    },
} satisfies Meta<typeof SptTabs>;

export default meta;

type Story = StoryObj<typeof SptTabs>;

export const Basic: Story = {
    name: '基础用法',
    args: {
        items: [
            {
                label: '标签页1',
                key: 'tab1',
                children: '标签页1的内容'
            },
            {
                label: '标签页2', 
                key: 'tab2',
                children: '标签页2的内容'
            },
            {
                label: '标签页3',
                key: 'tab3', 
                children: '标签页3的内容'
            }
        ]
    },
    render: ({ ...args }) => {
        return (
            <SptTabs {...args} />
        )
    }
}


export const InlineBadgeTab: Story = {
    name: '行内徽标',
    args: {
        items: [
            {
                label: '全部',
                key: 'all',
            },
            {
                label: '进行中',
                key: 'processing',
                count: 12,
            },
            {
                label: '已完成',
                key: 'completed',
                count: 100,
            }
        ],
    },
    render: ({ ...args }) => {
        return (
            <SptTabs {...args} />
        )
    }
}

export const CornerBadgeTab: Story = {
    name: '角标徽标',
    args: {
        items: [
            {
                label: '全部任务',
                key: 'all',
            },
            {
                label: '待处理',
                key: 'pending',
                count: 12,
            },
            {
                label: '已逾期',
                key: 'overdue',
                count: 100,
            }
        ],
        badgeType: SptTabBadgeType.Corner
    },
    render: ({ ...args }) => {
        return (
            <SptTabs {...args} />
        )
    }
}

export const CustomBadgeStyle: Story = {
    name: '自定义徽标样式',
    args: {
        items: [
            {
                label: '全部',
                key: 'all',
            },
            {
                label: '警告',
                key: 'warning',
                count: 3,
            },
            {
                label: '错误',
                key: 'error',
                count: 5,
            }
        ],
        badgeType: SptTabBadgeType.Corner,
        badgeProps: {
            color: '#f50',
            size: 'small'
        }
    }
}

const Count: FC = () => {
    const [count, setCount] = useState(0);

    return (
        <div style={{ padding: 16 }}>
            <button onClick={() => setCount(count + 1)}>增加计数</button>
            <span style={{ marginLeft: 8 }}>当前值: {count}</span>
        </div>
    )
}

/**
 * 
 */
export const TabPanelDestroy: Story = {
    name: '标签页内容销毁',
    args: {
        items: [
            {
                label: '标签页 1',
                key: 'tab1',
                children: <Count key="count1" />
            },
            {
                label: '标签页 2',
                key: 'tab2',
                children: <Count key="count2" />
            },
        ],
        destroyInactiveTabPane: true
    }
}

export const SizeVariants: Story = {
    name: '不同尺寸',
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <SptTabs
                size="large"
                items={[
                    { label: '大尺寸1', key: '1' },
                    { label: '大尺寸2', key: '2', count: 8 }
                ]}
            />
            <SptTabs
                items={[
                    { label: '默认1', key: '1' },
                    { label: '默认2', key: '2', count: 8 }
                ]}
            />
            <SptTabs
                size="small"
                items={[
                    { label: '小尺寸1', key: '1' },
                    { label: '小尺寸2', key: '2', count: 8 }
                ]}
            />
        </div>
    )
}