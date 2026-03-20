import type { Meta, StoryObj } from '@storybook/react';
import Button from './index';
import React from 'react';
import { Space } from 'antd';

const meta = {
  title: 'Components/通用/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    type: {
      options: ['default', 'primary', 'dashed', 'link', 'text', 'grey'],
      control: { type: 'select' }
    },
    size: {
      options: ['small', 'middle', 'large'], 
      control: { type: 'radio' }
    },
    disabled: {
      control: 'boolean'
    },
    loading: {
      control: 'boolean'
    },
    color: {
      options: ['default', 'white', 'danger', 'success'],
      control: { type: 'select' }
    }
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 基础按钮示例。点击按钮会触发点击事件。
 * 
 * 
 * ```typescript
 * // 基础按钮
 * <Button>基础按钮</Button>
 * 
 * // 带点击事件
 * <Button onClick={() => console.log('按钮被点击')}>
 *   点击按钮
 * </Button>
 * ```
 */
export const Basic: Story = {
  args: {
    children: '基础按钮',
  }
};

/**
 * 主要按钮示例。使用 type 属性来设置不同的按钮样式。
 * 
 * 
 * ```typescript
 * // 主要按钮
 * <Button type="primary">主要按钮</Button>
 * 
 * // 虚线按钮
 * <Button type="dashed">虚线按钮</Button>
 * 
 * // 链接按钮
 * <Button type="link">链接按钮</Button>
 * 
 * // 文本按钮
 * <Button type="text">文本按钮</Button>
 * ```
 */
export const Primary: Story = {
  args: {
    type: 'primary',
    children: '主要按钮',
  },
  render: () => (
    <Space>
        <Button type="primary">主要按钮</Button>
        <Button type="dashed">虚线按钮</Button>
        <Button type="link">链接按钮</Button>
        <Button type="text">文本按钮</Button>
    </Space>
  )
};


/**
 * 灰色按钮示例
 * 
 * 
 * ```typescript
 * <Button type="grey">灰色按钮</Button>
 * ```
 */
export const Grey: Story = {
  args: {
    type: 'grey',
    children: '灰色按钮',
  },
};

/**
 * 不同尺寸按钮示例。使用 size 属性设置按钮大小。
 * 
 * 
 * ```typescript
 * // 在组件中使用
 * import { Space } from 'antd';
 * 
 * export default () => (
 *   <Space>
 *     <Button size="small">小按钮</Button>
 *     <Button size="middle">中按钮</Button>
 *     <Button size="large">大按钮</Button>
 *   </Space>
 * );
 * ```
 */
export const Sizes: Story = {
  render: () => (
    <>
      <Button size="small">小按钮</Button>
      <Button size="middle" style={{ margin: '0 8px' }}>中按钮</Button>
      <Button size="large">大按钮</Button>
    </>
  )
};

/**
 * 加载中状态示例。使用 loading 属性控制加载状态。
 * 
 * 
 * ```typescript
 * // 简单的加载状态
 * <Button loading>加载中</Button>
 * 
 * // 动态控制加载状态
 * const [loading, setLoading] = useState(false);
 * 
 * <Button 
 *   loading={loading}
 *   onClick={() => {
 *     setLoading(true);
 *     setTimeout(() => setLoading(false), 2000);
 *   }}
 * >
 *   点击加载
 * </Button>
 * ```
 */
export const Loading: Story = {
  args: {
    loading: true,
    children: '加载中',
  },
  render: () => (
    <Space>
      <Button loading>加载中</Button>
      <Button type="primary" loading>加载中</Button>
      <Button type="dashed" loading>加载中</Button>
      <Button type="link" loading>加载中</Button>
      <Button type="text" loading>加载中</Button>
      <Button type="grey" loading>加载中</Button>
    </Space>
  )
};

/**
 * 禁用状态示例。使用 disabled 属性禁用按钮。
 * 
 * 
 * ```typescript
 * // 禁用基础按钮
 * <Button disabled>禁用按钮</Button>
 * 
 * // 禁用不同类型的按钮
 * <Space>
 *   <Button type="primary" disabled>主要按钮</Button>
 *   <Button type="dashed" disabled>虚线按钮</Button>
 *   <Button type="link" disabled>链接按钮</Button>
 * </Space>
 * ```
 */
export const Disabled: Story = {
  args: {
    disabled: true,
    children: '禁用按钮',
  },
  render: () => (
    <Space>
      <Button type="primary" disabled>主要按钮</Button>
      <Button type="default" disabled>默认按钮</Button>
      <Button type="dashed" disabled>虚线按钮</Button>
      <Button type="link" disabled>链接按钮</Button>
      <Button type="grey" disabled>灰色按钮</Button>
    </Space>
  )
};

/**
 * 自动插入空格示例。使用 autoInsertSpace 属性在中英文之间自动添加空格。
 * 
 * 
 * ```typescript
 * // 自动在中英文之间插入空格
 * <Button autoInsertSpace>Button按钮</Button>
 * 
 * // 更多示例
 * <Space>
 *   <Button autoInsertSpace>Click这里</Button>
 *   <Button autoInsertSpace>提交Submit</Button>
 *   <Button autoInsertSpace type="primary">确认OK</Button>
 * </Space>
 * ```
 */
export const AutoInsertSpace: Story = {
  args: {
    autoInsertSpace: true,
    children: 'Button文字',
  },
};
/**
 * 带提示的按钮示例。
 * 
 * 通过 tooltip 属性可以为按钮添加提示信息。tooltip 支持两种使用方式:
 * 1. 直接传入字符串作为简单提示文本
 * 2. 传入对象进行更详细的配置,如位置、样式等
 * 
 * ```typescript
 * // 简单文本提示
 * <Button tooltip="这是一个提示">悬停查看提示</Button>
 * 
 * // 自定义 Tooltip 配置
 * <Button 
 *   tooltip={{
 *     title: "自定义提示",
 *     placement: "right"  // 提示显示在右侧
 *   }}
 * >
 *   自定义提示
 * </Button>
 * ```
 */
export const WithTooltip: Story = {
    args: {
        tooltip: '这是一个提示信息',
        children: '悬停查看提示',
    },
    render: () => (
        <Space>
            <Button tooltip="简单提示">基础提示</Button>
            <Button
                tooltip={{
                    title: '自定义提示',
                    placement: 'right',
                }}
            >
                自定义提示
            </Button>
        </Space>
    ),
};

/**
 * 不同颜色按钮示例。使用 color 属性设置不同的颜色。
 * 
 * 
 * ```typescript
 * <Button color="default">默认按钮</Button>
 * <Button color="white">白色按钮</Button>
 * <Button color="danger">危险按钮</Button>
 * <Button color="success">成功按钮</Button>
 * ```
 */
export const Colors: Story = {
    args: {
        color: 'default',
        children: '默认按钮',
    },
    render: () => (
        // <div style={{ display: 'flex', flexDirection: 'column', gap: 16, backgroundColor: '#F5F5F5', padding: 16 }}>
            <Space direction="vertical">
                <Space>
                    <Button color="default">默认按钮</Button>
                    <Button color="white">白色按钮</Button>
                    <Button color="danger">危险按钮</Button>
                    <Button color="success">成功按钮</Button>
                </Space>
                <Space>
                    <Button color="default" disabled>默认按钮</Button>
                    <Button color="white" disabled>白色按钮</Button>
                    <Button color="danger" disabled>危险按钮</Button>
                    <Button color="success" disabled>成功按钮</Button>
                </Space>
                <Space>
                    <Button color="default" loading>默认按钮</Button>
                    <Button color="white" loading>白色按钮</Button>
                    <Button color="danger" loading>危险按钮</Button>
                    <Button color="success" loading>成功按钮</Button>
                </Space>
            </Space>
        // </div>
    )
};
