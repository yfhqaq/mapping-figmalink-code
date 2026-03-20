import { Meta, StoryObj } from '@storybook/react';
import SptTitle from '.';

const meta = {
    title: 'Components/通用/SptTitle',
    component: SptTitle,
    tags: ['autodocs']
} satisfies Meta<typeof SptTitle>;

export default meta;

type Story = StoryObj<typeof SptTitle>;

export const Bigger: Story = {
    args: {
        size: 'bigger',
        hasColorBlock: true,
        children: '大标题'
    }
};

export const Medium: Story = {
    args: {
        size: 'medium',
        hasColorBlock: true,
        children: '中标题'
    }
};


export const Small: Story = {
    args: {
        size: 'small',
        hasColorBlock: true,
        children: '小标题',
        description: '描述'
    }
};


export const Bold: Story = {
    args: {
        size: 'medium',
        weight: 'bold',
        children: '加粗标题'
    }
};


export const Normal: Story = {
    args: {
        size: 'medium',
        weight: 'normal',
        children: '不加粗标题',
    }
};
