import type { Meta, StoryObj } from '@storybook/react';
import SptUserAvatar from '.';
import React from 'react';

const meta = {
    title: 'Components/通用/SptUserAvatar',
    component: SptUserAvatar,
    tags: ['autodocs'],
} satisfies Meta<typeof SptUserAvatar>;

export default meta;

type Story = StoryObj<typeof SptUserAvatar>;

export const Default: Story = {
    name: '默认展示',
    args: {
        name: 'Nic'
    },
    render: ({ ...args }) => {
        return <SptUserAvatar {...args} />
    }
};

export const Loading: Story = {
    name: 'Loading 状态',
    args: {
        loading: true,
        name: 'TEST HELLO WOLRD!!!'
    },
    render: ({ ...args }) => {
        return <SptUserAvatar {...args} />
    }
};