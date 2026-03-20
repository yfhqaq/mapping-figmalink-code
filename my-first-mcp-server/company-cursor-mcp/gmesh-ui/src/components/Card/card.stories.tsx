import type { Meta, StoryObj } from '@storybook/react';
import Card from './index';

const meta = {
  title: 'Components/通用/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    bordered: {
      control: 'boolean',
      description: '是否显示边框',
      defaultValue: true
    },
    title: {
      control: 'text',
      description: '卡片标题'
    },
    headerClassName: {
      control: 'text',
      description: '头部类名'
    },
    bodyClassName: {
      control: 'text',
      description: '内容区类名'
    }
  }
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基础卡片示例。
 * 
 * ```typescript
 * // 基础卡片
 * <Card title="基础卡片">
 *   卡片内容
 * </Card>
 * 
 * // 无边框卡片
 * <Card title="无边框卡片" bordered={false}>
 *   卡片内容
 * </Card>
 * ```
 */
export const Basic: Story = {
  args: {
    title: '基础卡片',
    children: '卡片内容'
  }
};

/**
 * 自定义样式卡片示例。
 * 
 * ```typescript
 * <Card 
 *   title="自定义样式" 
 *   headerClassName="custom-header"
 *   bodyClassName="custom-body"
 * >
 *   自定义样式卡片内容
 * </Card>
 * ```
 */
export const CustomStyle: Story = {
  args: {
    title: '自定义样式',
    headerClassName: 'custom-header',
    bodyClassName: 'custom-body',
    children: '自定义样式卡片内容'
  }
};
