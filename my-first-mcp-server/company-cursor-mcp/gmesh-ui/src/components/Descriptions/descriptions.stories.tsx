import type { Meta, StoryObj } from '@storybook/react';
import Descriptions from './index';

const meta: Meta<typeof Descriptions> = {
    title: 'Components/反馈/Descriptions',
    component: Descriptions,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Descriptions>;

export const Default: Story = {
    args: {
        title: '用户信息',
        items: [
            {
                key: '1',
                label: '用户名',
                children: 'Zhou Jielun',
            },
            {
                key: '2', 
                label: '手机号',
                children: '1234567890',
            },
            {
                key: '3',
                label: '居住地',
                children: '杭州市',
            },
        ],
    },
};

export const WithBorder: Story = {
    args: {
        ...Default.args,
        bordered: true,
    },
};

export const Column2: Story = {
    args: {
        ...Default.args,
        column: 2,
    },
};
