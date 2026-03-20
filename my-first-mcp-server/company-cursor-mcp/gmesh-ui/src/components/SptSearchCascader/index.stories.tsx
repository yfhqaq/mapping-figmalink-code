import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import SptSearchCascader, { SptSearchCascaderProps } from '.';

//👇 This default export determines where your story goes in the story list
const meta = {
    title: 'Components/数据录入/SptSearchCascader',
    tags: ['autodocs']
} satisfies Meta;

export default meta;

type Story = StoryObj<SptSearchCascaderProps>;

const options = [
    {
        value: 'zhejiang',
        label: 'Zhejiang',
        children: [
            {
                value: 'hangzhou',
                label: 'Hangzhou',
                children: [
                    {
                        value: 'xihu',
                        label: 'West Lake',
                    },
                ],
            },
        ],
    },
    {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
            {
                value: 'nanjing',
                label: 'Nanjing',
                children: [
                    {
                        value: 'zhonghuamen',
                        label: 'Zhong Hua Men',
                    },
                ],
            },
        ],
    },
]

export const Default: Story = {
    name: 'SptSearchCascader',
    args: {
        label: '款项类型',
        fieldProps: {
            options,
        }
    },
    render: (args) => {
        return (
            <div style={{padding: '60px 0'}}>
                <SptSearchCascader name="test" {...args} />
            </div>
        );
    }
};

export const Multiple: Story = {
    name: 'Multiple',
    args: {
        label: '款项类型',
        fieldProps: {
            options,
            multiple: true,
            showSearch: true,
            maxTagCount: 'responsive',
        }
    },
    render: (args) => {
        return (
            <div style={{padding: '60px 0'}}>
                <SptSearchCascader name="test" {...args} />
            </div>
        );
    }
};