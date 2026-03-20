import type { Meta, StoryObj } from '@storybook/react';
import SptCurrency from '.';
import React from 'react';

const meta = {
    title: 'Components/通用/SptCurrency',
    component: SptCurrency,
    tags: ['autodocs'],
} satisfies Meta<typeof SptCurrency>;

export default meta;

type Story = StoryObj<typeof SptCurrency>;

export const Default: Story = {
    args: {
        amount: 128.28
    },
};
