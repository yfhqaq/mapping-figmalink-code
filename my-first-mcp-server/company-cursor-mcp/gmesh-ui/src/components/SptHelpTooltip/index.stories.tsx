import type { Meta, StoryObj } from '@storybook/react';
import SptHelpTooltip from '.';

const meta = {
    title: 'Components/提示/SptHelpTooltip',
    component: SptHelpTooltip,
    tags: ['autodocs'],
} satisfies Meta<typeof SptHelpTooltip>;

export default meta;

type Story = StoryObj<typeof SptHelpTooltip>;

export const demo: Story = {
    name: 'first demo',
    args: {
        help: 'This is help message!'
    },
}