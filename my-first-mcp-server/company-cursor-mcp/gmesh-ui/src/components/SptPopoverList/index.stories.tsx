import { Meta, StoryObj } from '@storybook/react';
import SptPopoverList from '.';
import React from 'react';
import SptAsinLink from '../SptAsinLink';

const meta = {
    title: 'Components/反馈/SptPopoverList',
    component: SptPopoverList,
    tags: ['autodocs']
} satisfies Meta<typeof SptPopoverList>;

export default meta;

type Story = StoryObj<typeof SptPopoverList>;

export const AsinList: Story = {
    name: '默认渲染',
    args: {
        list: [
            'B0B7WLPTG1',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B7WLPTG1',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B7WLPTG1',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B7WLPTG1',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B7WLPTG1',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B7WLPTG1',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J'
        ]
    }
};

export const DealAsinList: Story = {
    name: '自定义 Item 渲染',
    args: {
        ellipsis: true,
        list: [
            'B0B7WLPTG1',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B7WLPTG1',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B7WLPTG1',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B7WLPTG1',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B7WLPTG1',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B7WLPTG1',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J'
        ],
    },
    render: ({ ...args }) => {
        return (
            <SptPopoverList
                {...args}
                renderItem={(item) => {
                    return <SptAsinLink asin={item} />;
                }}
            />
        );
    }
};

export const CustomList: Story = {
    name: '自定义渲染',
    args: {
        list: [
            'B0B7WLPTG1',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B7WLPTG1',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B7WLPTG1',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B7WLPTG1',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B7WLPTG1',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B7WLPTG1',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J'
        ],
        showCount: false
    },
    render: ({ ...args }) => {
        return (
            <SptPopoverList
                {...args}
            >
                xxxxxx
            </SptPopoverList>
        );
    }
};
