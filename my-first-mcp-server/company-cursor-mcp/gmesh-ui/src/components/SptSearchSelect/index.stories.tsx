import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import {SptSearchSelect, SptSearchSelectProps} from '.';
import SptButton from '../Button';
import { Form } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

//👇 This default export determines where your story goes in the story list
const meta = {
    title: 'Components/数据录入/SptSearchSelect',
    tags: ['autodocs']
} satisfies Meta;

export default meta;

type Story = StoryObj<SptSearchSelectProps>;

const options = () => {
    const optArr = []
    for (let i = 0; i < 3; i++) {
        optArr.push({
            label: 'label' + i,
            value: 'value' + i
        })
    }
    return optArr;
}

export const Default: Story = {
    name: 'SptSearchSelect',
    args: {
        label: '款项类型',
        fieldProps: {
            options: options()
        }
    },
    render: (args) => {
        const [value, setValue] = useState(0);
        const [form] = Form.useForm();
        
        return (
            <div style={{padding: '90px 0'}}>
                <div>
                    {value}
                <SptButton onClick={() => {
                    setValue(value + 1);
                }}>
                    +1
                </SptButton>
                </div>
                <SptSearchSelect {...args} />
                <div style={{ marginTop: 20 }}>
                    <h3>表单测试</h3>
                    <Form 
                        form={form}
                        onFinish={() => {
                            console.log('提交表单');
                        }}
                    >
                        <SptSearchSelect 
                            label="表单内选择器"
                            name="hello"
                            fieldProps={{
                                options: options(),
                            }}
                        />
                        <div style={{ marginTop: 16 }}>
                            <SptButton 
                                htmlType="submit" 
                                style={{ marginRight: 8 }}
                            >
                                提交
                            </SptButton>
                            <SptButton 
                                onClick={(e) => {
                                    e.preventDefault();
                                    form.resetFields();
                                }}
                            >
                                重置
                            </SptButton>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }
};

export const Multiple: Story = {
    name: 'Multiple - 多选',
    args: {
        label: '多选',
        mode: 'multiple',
        fieldProps: {
            mode: 'multiple',
            options: options(),
            showSearch: false
        },
    },
    render: (args) => {
        return (
            <div style={{padding: '90px 0'}}>
                <SptSearchSelect {...args} />
            </div>
        );
    }
};

export const Tags: Story = {
    name: 'Tags - 标签',
    args: {
        label: '标签',
        fieldProps: {
            // mode: 'tags',
            // maxTagCount: 'responsive',
            mode: 'tags',
            open: false,
            tokenSeparators: [',', '，', ';', '；', '\n', ' ', '\r'],
            placeholder: '多个信息使用逗号或空格隔开',
            className: 'my-class-name',
            maxTagCount: 1,
        },
    },
    render: (args) => {
        return (
            <div style={{padding: '90px 0'}}>
                <SptSearchSelect {...args} />
            </div>
        );
    }
};

export const WithPrefix: Story = {
    name: 'Prefix - 前缀',
    args: {
        label: '前缀',
        fieldProps: {
            options: options(),
            prefix: <SearchOutlined />,
            placeholder: '请输入搜索内容'
        },
    },
    render: (args) => {
        return (
            <div style={{padding: '90px 0'}}>
                <SptSearchSelect {...args} />
            </div>
        );
    }
};

