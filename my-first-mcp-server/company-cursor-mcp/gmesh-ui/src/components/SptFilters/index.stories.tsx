import type { Meta, StoryObj } from '@storybook/react';
import { SptSelectWithInnerLabel } from "./SelectWithInnerLabel";
import React from 'react';
import { SearchOutlined } from '@ant-design/icons';

const meta = {
    title: 'Components/数据录入/SptSelectWithInnerLabel',
    component: SptSelectWithInnerLabel,
    tags: ['autodocs'],
    argTypes: {
        label: {
            description: '内联标签文本',
            control: 'text',
        },
        prefix: {
            description: '前缀图标或内容',
            control: 'boolean',
        },
        showSearch: {
            description: '是否显示搜索框',
            control: 'boolean',
        },
        mode: {
            description: '选择模式',
            control: 'select',
            options: [undefined, 'multiple', 'tags'],
        },
        disabled: {
            description: '是否禁用',
            control: 'boolean',
        },
        loading: {
            description: '加载状态',
            control: 'boolean',
        },
    }
} satisfies Meta<typeof SptSelectWithInnerLabel>;

export default meta;

type Story = StoryObj<typeof SptSelectWithInnerLabel>;

const mockOptions = [
    { label: '全部', value: '' },
    { label: '选项一', value: '1' },
    { label: '选项二', value: '2' },
    { label: '选项三', value: '3' },
    { label: '宇宙中心 (hotfix—test)', value: 'hotfix—test' }
];

// 基础用法
export const Default: Story = {
    args: {
        label: '基础选择',
        style: { width: 200 },
        defaultValue: '',
        options: mockOptions,
    },
};

// 带搜索功能
export const WithSearch: Story = {
    args: {
        label: '搜索选择',
        style: { width: 200 },
        showSearch: true,
        options: mockOptions,
        placeholder: '请输入搜索关键词',
    },
};

// 带前缀图标
export const WithPrefix: Story = {
    args: {
        label: '带图标',
        style: { width: 200 },
        prefix: <SearchOutlined />,
        showSearch: true,
        options: mockOptions,
    },
};

// 多选模式
export const Multiple: Story = {
    args: {
        label: '多选',
        style: { width: 300 },
        mode: 'multiple',
        showSearch: true,
        options: mockOptions,
        placeholder: '请选择多个选项',
    },
};

// 标签模式
export const Tags: Story = {
    args: {
        label: '标签',
        style: { width: 300 },
        mode: 'tags',
        options: mockOptions,
        placeholder: '请输入或选择标签',
    },
};

// 禁用状态
export const Disabled: Story = {
    args: {
        label: '禁用状态',
        style: { width: 200 },
        disabled: true,
        defaultValue: '1',
        options: mockOptions,
    },
};

// 加载状态
export const Loading: Story = {
    args: {
        label: '加载中',
        style: { width: 200 },
        loading: true,
        options: mockOptions,
    },
};

// 自定义过滤示例
export const CustomFilter: Story = {
    args: {
        label: '自定义过滤',
        style: { width: 200 },
        showSearch: true,
        options: mockOptions,
        filterOption: (input: string, option: any) => 
            option?.label?.toLowerCase().indexOf(input.toLowerCase()) === 0, // 只匹配开头
    },
};

// 组合场景示例
export const CombinedScenario: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <SptSelectWithInnerLabel
                label="状态"
                style={{ width: 200 }}
                options={[
                    { label: '全部', value: '' },
                    { label: '进行中', value: 'processing' },
                    { label: '已完成', value: 'done' },
                ]}
            />
            <SptSelectWithInnerLabel
                label="优先级"
                style={{ width: 200 }}
                mode="multiple"
                options={[
                    { label: 'P0', value: 'p0' },
                    { label: 'P1', value: 'p1' },
                    { label: 'P2', value: 'p2' },
                ]}
            />
            <SptSelectWithInnerLabel
                label="搜索"
                style={{ width: 200 }}
                showSearch
                prefix={<SearchOutlined />}
                options={mockOptions}
            />
        </div>
    ),
};
