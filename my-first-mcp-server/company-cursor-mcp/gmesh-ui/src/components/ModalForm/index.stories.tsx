import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button, Form, Input } from 'antd';
import ModalForm from './index';

const meta: Meta<typeof ModalForm> = {
  title: 'Components/表单/ModalForm',
  component: ModalForm,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ModalForm>;

export const Basic: Story = {
  render: () => {
    const [form] = Form.useForm();
    
    return (
      <ModalForm
        title="基础模态表单"
        trigger={<Button type="primary">打开表单</Button>}
        form={form}
        autoFocusFirstInput
        onFinish={async (values) => {
          console.log(values);
          return true;
        }}
      >
        <Form.Item
          name="name"
          label="姓名"
          rules={[{ required: true, message: '请输入姓名' }]}
        >
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' }
          ]}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>
      </ModalForm>
    );
  }
};

export const CustomWidth: Story = {
  render: () => (
    <ModalForm
      title="自定义宽度"
      trigger={<Button>宽度800px的表单</Button>}
      width={800}
      onFinish={async (values) => {
        console.log(values);
        return true;
      }}
    >
      <Form.Item
        name="content"
        label="内容"
      >
        <Input.TextArea rows={4} placeholder="请输入内容" />
      </Form.Item>
    </ModalForm>
  )
};


export const CustomSubmitter: Story = {
    render: () => (
      <ModalForm
        title="自定义提交器"
        trigger={<Button>自定义提交器</Button>}
        width={800}
        modalProps={{
            okText: 'OK',
        }}
        submitter={false}
        onFinish={async (values) => {
          console.log(values);
          return true;
        }}
      >
        <Form.Item
          name="content"
          label="内容"
        >
          <Input.TextArea rows={4} placeholder="请输入内容" />
        </Form.Item>
      </ModalForm>
    )
  };
  