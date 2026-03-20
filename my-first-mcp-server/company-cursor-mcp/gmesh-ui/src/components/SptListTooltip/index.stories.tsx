import { Meta, StoryObj } from "@storybook/react";
import SptListTooltip from ".";

const meta = {
    title: 'Components/反馈/SptListTooltip',
    component: SptListTooltip,
    tags: ['autodocs'],
} satisfies Meta<typeof SptListTooltip>;

export default meta;

type Story = StoryObj<typeof SptListTooltip>;

export const AsinList: Story = {
    args: {
        text: 'B0B7WLPTG1',
        list: [
            'B0B7WLPTG1',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J',
            'B0B42NZ19J'
        ],
    },
}