import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SptSearchTreeSelect, SptSearchTreeSelectProps } from '.';
import { Space, Switch } from 'antd';

//👇 This default export determines where your story goes in the story list
const meta = {
  title: 'Components/数据录入/SptSearchTreeSelect',
  tags: ['autodocs']
} satisfies Meta;

export default meta;

type Story = StoryObj<SptSearchTreeSelectProps>;

// 模拟树形数据
const mockTreeData = [
  {
    "id": 1,
    "name": "通知",
    "subConfigBusinessTypeList": [
      {
        "id": 3,
        "name": "行动计划",
        "parentId": 1
      },
      {
        "id": 7,
        "name": "放假通知",
        "parentId": 1
      },
      {
        "id": 8,
        "name": "结算相关",
        "parentId": 1
      },
      {
        "id": 9,
        "name": "包装认证",
        "parentId": 1
      }
    ]
  },
  {
    "id": 2,
    "name": "更新日志",
    "subConfigBusinessTypeList": [
      {
        "id": 5,
        "name": "SEVC更新通知",
        "parentId": 2
      }
    ]
  },
  {
    "id": 4,
    "name": "News",
    "subConfigBusinessTypeList": [
      {
        "id": 23,
        "name": "注意事项",
        "parentId": 4
      }
    ]
  }
];

// 模拟请求函数
const mockRequest = async () => {
  return Promise.resolve(mockTreeData);
};

export const Default: Story = {
  name: 'SptSearchTreeSelect',
  args: {
    request: mockRequest,
    label: '消息类型',
    width: 350,
    fieldProps: {
      allowClear: true,
      placeholder: '请选择',
      fieldNames: {
        children: 'subConfigBusinessTypeList',
        label: 'name',
        value: 'id',
      },
      maxTagCount: 2,
      maxTagTextLength: 10,
      multiple: true,
      //   treeCheckable: true,
      showSearch: true,
      filterTreeNode: true,
      treeNodeFilterProp: 'name',
      treeDefaultExpandAll: true, // 默认展开
    },
  },
  render: (args) => {
    return (
      <SptSearchTreeSelect {...args} />
    );
  }
};


export const Demo: Story = {
    name: 'SptSearchTreeSelect-Demo',
    args: {
      request: async () => [
        {
          "id": 1,
          "name": "通知",
          "subConfigBusinessTypeList": [
            {
              "id": 3,
              "name": "行动计划",
              "parentId": 1
            },
            {
              "id": 7,
              "name": "放假通知",
              "parentId": 1
            },
            {
              "id": 8,
              "name": "结算相关",
              "parentId": 1
            }
          ]
        },
      ],
      label: '消息类型消息类型',
      width: 350,
      fieldProps: {
            allowClear: true,
            fieldNames: { label: 'name', value: 'id', children: 'subConfigBusinessTypeList' },
            placeholder: '请选择',
            multiple: true,
            showSearch: true,
            treeCheckable: true,
        },

    },
    render: (args) => {
      return (
        <SptSearchTreeSelect {...args} />
      );
    }
  };

// 单选模式示例
export const SingleSelect: Story = {
  name: '单选模式',
  args: {
    request: mockRequest,
    label: '消息类型',
    width: 350,
    fieldProps: {
      allowClear: true,
      fieldNames: {
        children: 'subConfigBusinessTypeList',
        label: 'name',
        value: 'id',
      },
      placeholder: '请选择',
      showSearch: true,
      treeDefaultExpandAll: true,
    },
  },
  render: (args) => <SptSearchTreeSelect {...args} />,
};

// 可勾选示例
export const Checkable: Story = {
  name: '可勾选模式',
  args: {
    request: mockRequest,
    label: '消息类型',
    width: 350,
    fieldProps: {
      allowClear: true,
      fieldNames: {
        children: 'subConfigBusinessTypeList',
        label: 'name',
        value: 'id',
      },
      placeholder: '请选择',
      treeCheckable: true,
      showCheckedStrategy: 'SHOW_PARENT',
      treeDefaultExpandAll: true,
    },
  },
  render: (args) => <SptSearchTreeSelect {...args} />,
};

// 异步加载数据示例
export const AsyncLoading: Story = {
  name: '异步加载数据',
  render: () => {
    const [treeData, setTreeData] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const onLoadData = () => {
      setLoading(true);
      setTimeout(() => {
        setTreeData(mockTreeData);
        setLoading(false);
      }, 1000);
    };
    
    return (
      <Space direction="vertical">
        <Switch 
          checkedChildren="已加载" 
          unCheckedChildren="点击加载" 
          onChange={onLoadData} 
        />
        <SptSearchTreeSelect
          label="异步加载"
          width={350}
          fieldProps={{
            treeData: treeData,
            loading: loading,
            fieldNames: {
              children: 'subConfigBusinessTypeList',
              label: 'name',
              value: 'id',
            },
            placeholder: '请选择',
            treeDefaultExpandAll: true,
          }}
        />
      </Space>
    );
  }
};

// 自定义过滤示例
export const CustomFilter: Story = {
  name: '自定义搜索过滤',
  args: {
    request: mockRequest,
    label: '消息类型',
    width: 350,
    fieldProps: {
      allowClear: true,
      fieldNames: {
        children: 'subConfigBusinessTypeList',
        label: 'name',
        value: 'id',
      },
      placeholder: '请选择',
      showSearch: true,
      filterTreeNode: (inputValue, treeNode) => {
        return treeNode.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
      },
      treeDefaultExpandAll: true,
    },
  },
  render: (args) => <SptSearchTreeSelect {...args} />,
};

// 禁用状态示例
export const Disabled: Story = {
  name: '禁用状态',
  args: {
    request: mockRequest,
    label: '消息类型',
    width: 350,
    fieldProps: {
      disabled: true,
      fieldNames: {
        children: 'subConfigBusinessTypeList',
        label: 'name',
        value: 'id',
      },
      placeholder: '请选择',
      treeDefaultExpandAll: true,
    },
  },
  render: (args) => <SptSearchTreeSelect {...args} />,
};

// 自定义显示标签数量
export const CustomTagDisplay: Story = {
  name: '自定义标签显示',
  args: {
    request: mockRequest,
    label: '消息类型',
    width: 350,
    fieldProps: {
      allowClear: true,
      fieldNames: {
        children: 'subConfigBusinessTypeList',
        label: 'name',
        value: 'id',
      },
      placeholder: '请选择',
      multiple: true,
      maxTagCount: 'responsive',
      treeDefaultExpandAll: true,
    },
  },
  render: (args) => <SptSearchTreeSelect {...args} />,
};