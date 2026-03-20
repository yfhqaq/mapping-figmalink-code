import type { Meta, StoryObj } from '@storybook/react';
import SptAsinLink from '.';

const meta = {
    title: 'Components/导航/SptAsinLink',
    component: SptAsinLink,
    tags: ['autodocs'],
} satisfies Meta<typeof SptAsinLink>;

export default meta;

type Story = StoryObj<typeof SptAsinLink>;

export const Default: Story = {
    args: {
        asin: 'ASIN12398120238'
    },
};
