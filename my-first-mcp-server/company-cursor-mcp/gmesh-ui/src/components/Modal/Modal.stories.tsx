import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from 'antd';
import SptModal from './index';

const meta: Meta<typeof SptModal> = {
  title: 'Components/反馈/SptModal',
  component: SptModal,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: '基于 Ant Design Modal 组件的二次封装，提供统一的样式和配置。',
      },
    },
  },
  argTypes: {
    afterClose: {
      description: 'Modal 完全关闭后的回调',
      control: 'function'
    },
    classNames: {
      description: '配置弹窗内置模块的 className',
      control: false
    },
    styles: {
      description: '配置弹窗内置模块的 style',
      control: false
    },
    cancelButtonProps: {
      description: 'cancel 按钮 props',
      control: false
    },
    cancelText: {
      description: '取消按钮文字',
      control: 'text',
      defaultValue: '取消'
    },
    centered: {
      description: '垂直居中展示 Modal',
      control: 'boolean',
      defaultValue: false
    },
    closable: {
      description: '是否显示右上角的关闭按钮',
      control: 'boolean',
      defaultValue: true
    },
    closeIcon: {
      description: '自定义关闭图标',
      control: false
    },
    confirmLoading: {
      description: '确定按钮 loading',
      control: 'boolean',
      defaultValue: false
    },
    destroyOnClose: {
      description: '关闭时销毁 Modal 里的子元素',
      control: 'boolean',
      defaultValue: false
    },
    focusTriggerAfterClose: {
      description: '对话框关闭后是否需要聚焦触发元素',
      control: 'boolean',
      defaultValue: true
    },
    footer: {
      description: '底部内容',
      control: false
    },
    forceRender: {
      description: '强制渲染 Modal',
      control: 'boolean',
      defaultValue: false
    },
    keyboard: {
      description: '是否支持键盘 esc 关闭',
      control: 'boolean',
      defaultValue: true
    },
    mask: {
      description: '是否展示遮罩',
      control: 'boolean',
      defaultValue: true
    },
    maskClosable: {
      description: '点击蒙层是否允许关闭',
      control: 'boolean',
      defaultValue: true
    },
    okButtonProps: {
      description: 'ok 按钮 props',
      control: false
    },
    okText: {
      description: '确认按钮文字',
      control: 'text',
      defaultValue: '确定'
    },
    okType: {
      description: '确认按钮类型',
      control: 'select',
      options: ['default', 'primary', 'ghost', 'dashed', 'link', 'text'],
      defaultValue: 'primary'
    },
    style: {
      description: '可用于设置浮层的样式',
      control: false
    },
    loading: {
      description: '显示骨架屏',
      control: 'boolean'
    },
    title: {
      description: '标题',
      control: 'text'
    },
    open: {
      description: '对话框是否可见',
      control: 'boolean'
    },
    width: {
      description: '宽度',
      control: { type: 'number' }
    },
    wrapClassName: {
      description: '对话框外层容器的类名',
      control: 'text'
    },
    zIndex: {
      description: '设置 Modal 的 z-index',
      control: 'number',
      defaultValue: 1000
    },
    onCancel: {
      description: '点击遮罩层或右上角叉或取消按钮的回调',
      control: 'function'
    },
    onOk: {
      description: '点击确定回调',
      control: 'function'
    },
    afterOpenChange: {
      description: '打开和关闭 Modal 时动画结束后的回调',
      control: 'function'
    }
  }
};

export default meta;
type Story = StoryObj<typeof SptModal>;

// 基础用法
export const Basic: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>打开模态框</Button>
        <SptModal
          title="基础模态框"
          open={isOpen}
          onOk={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
        >
          <p>这是一个基础模态框示例</p>
        </SptModal>
      </>
    );
  },
};

// 自定义宽度
export const CustomWidth: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>打开宽模态框</Button>
        <SptModal
          title="自定义宽度模态框"
          width={800}
          open={isOpen}
          onOk={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
        >
          <p>这是一个宽度为800px的模态框</p>
        </SptModal>
      </>
    );
  },
};

// 自定义样式
export const CustomStyle: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>自定义样式模态框</Button>
        <SptModal
          title="自定义样式模态框"
          open={isOpen}
          className="custom-modal"
          onOk={() => setIsOpen(false)}
          onCancel={() => setIsOpen(false)}
        >
          <p>这是一个使用自定义类名的模态框</p>
        </SptModal>
      </>
    );
  },
};

// 异步关闭
export const AsyncClose: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const handleOk = () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setIsOpen(false);
      }, 2000);
    };
    
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>异步关闭模态框</Button>
        <SptModal
          title="异步关闭模态框"
          open={isOpen}
          confirmLoading={loading}
          onOk={handleOk}
          onCancel={() => setIsOpen(false)}
        >
          <p>点击确定按钮2秒后关闭</p>
        </SptModal>
      </>
    );
  },
}; 

/**
 * 自定义页脚内容的模态框示例。
 * 
 * 可以通过 `footer` 属性自定义页脚内容，或者设置为 `null` 来隐藏页脚。
 * 
 * ```tsx
 * // 自定义页脚按钮
 * <SptModal
 *   title="自定义页脚"
 *   open={isOpen}
 *   footer={[
 *     <Button key="back" onClick={handleCancel}>返回</Button>,
 *     <Button key="submit" type="primary" onClick={handleOk}>提交</Button>
 *   ]}
 * >
 *   <p>自定义页脚内容的模态框</p>
 * </SptModal>
 * 
 * // 隐藏页脚
 * <SptModal
 *   title="无页脚模态框"
 *   open={isOpen}
 *   footer={null}
 * >
 *   <p>没有页脚的模态框</p>
 * </SptModal>
 * ```
 */
export const CustomFooter: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [noFooterOpen, setNoFooterOpen] = useState(false);
    
    return (
      <>
        <Button onClick={() => setIsOpen(true)} style={{ marginRight: 16 }}>自定义页脚</Button>
        <Button onClick={() => setNoFooterOpen(true)}>无页脚模态框</Button>
        
        <SptModal
          title="自定义页脚模态框"
          open={isOpen}
          footer={[
            <Button key="back" onClick={() => setIsOpen(false)}>返回</Button>,
            <Button key="submit" type="primary" onClick={() => setIsOpen(false)}>
              提交
            </Button>,
            <Button 
              key="custom" 
              type="primary" 
              danger 
              onClick={() => setIsOpen(false)}
            >
              删除
            </Button>
          ]}
          onCancel={() => setIsOpen(false)}
        >
          <div style={{ height: 1000 }}>这是一个带有自定义页脚按钮的模态框</div>
        </SptModal>
        
        <SptModal
          title="无页脚模态框"
          open={noFooterOpen}
          footer={null}
          onCancel={() => setNoFooterOpen(false)}
        >
          <p>这是一个没有页脚的模态框</p>
        </SptModal>
      </>
    );
  },
};
