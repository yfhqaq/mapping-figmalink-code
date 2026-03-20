import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {SptSearchDateMonthRangePicker, SptSearchDateMonthPickerProps} from '.';

//👇 This default export determines where your story goes in the story list
const meta = {
    title: 'Components/数据录入/SptSearchDateMonthRangePicker',
    tags: ['autodocs']
} satisfies Meta;

export default meta;

type Story = StoryObj<SptSearchDateMonthPickerProps>;

export const Default: Story = {
    name: 'SptSearchDateMonthRangePicker',
    args: {
        label: '出库日期',
    },
    render: (args) => {
        return (
            <SptSearchDateMonthRangePicker {...args} />
        );
    }
};
