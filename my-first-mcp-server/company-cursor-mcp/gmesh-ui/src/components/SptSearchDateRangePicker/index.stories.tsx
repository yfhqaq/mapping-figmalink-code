import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {SptSearchDateRangePicker, SptSearchDateRangePickerProps} from '.';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Button, Space } from 'antd';

//👇 This default export determines where your story goes in the story list
const meta = {
    title: 'Components/数据录入/SptSearchDateRangePicker',
    tags: ['autodocs']
} satisfies Meta;

export default meta;

type Story = StoryObj<SptSearchDateRangePickerProps>;

export const Default: Story = {
    name: 'SptSearchDateRangePicker',
    args: {
        label: '出库日期',
    },
    render: (args) => {
        return (
            <SptSearchDateRangePicker {...args} />
        );
    }
};

export const CustomFormat: Story = {
    name: '自定义格式',
    render: () => (
        <ProForm>
            <SptSearchDateRangePicker 
                name="dateRange" 
                label="日期范围" 
                fieldProps={{
                    format: 'YYYY/MM/DD',
                    showTime: true,
                }}
            />
        </ProForm>
    )
};


export const InSearchForm: Story = {
    name: '在搜索表单中使用',
    render: () => (
        <ProForm
            layout="inline"
            submitter={{
      render: (props) => (
        <Space>
          <Button type="primary" onClick={props.form?.submit}>
            搜索
          </Button>
          <Button onClick={() => props.form?.resetFields()}>
            重置
          </Button>
        </Space>
      ),
    }}
  >
    <ProFormText 
      name="keyword" 
      placeholder="请输入关键词" 
    />
    <SptSearchDateRangePicker 
                name="dateRange"
                label="日期范围"
            />
        </ProForm>
    )
};

export const DefaultProForm: Story = {
    name: '默认 ProForm',
    render: () => (
        <ProForm>
            <SptSearchDateRangePicker 
                name="dateRange" 
                label="日期范围" 
            />
        </ProForm>
    )
};

export const ValidateValue: Story = {
    name: '验证选择值',
    render: () => {
        const [selectedValue, setSelectedValue] = React.useState<string[]>([]);

        return (
            <div>
                <ProForm
                    onFinish={async (values) => {
                        setSelectedValue(values.dateRange);
                        return true;
                    }}
                >
                    <SptSearchDateRangePicker
                        name="dateRange"
                        label="日期范围"
                        fieldProps={{
                            onChange: (dates: any) => {
                                console.log('onChange dates:', dates);
                            }
                        }}
                    />
                    <Button type="primary" htmlType="submit">
                        提交
                    </Button>
                </ProForm>

                <div style={{ marginTop: 16 }}>
                    <h4>选择的值:</h4>
                    <pre>{JSON.stringify(selectedValue, null, 2)}</pre>
                </div>
            </div>
        );
    }
};
