import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {SptSearchDateTimeRangePicker, SptSearchDateTimeRangePickerProps} from '.';

//👇 This default export determines where your story goes in the story list
const meta = {
    title: 'Components/数据录入/SptSearchDateTimeRangePicker',
    tags: ['autodocs']
} satisfies Meta;

export default meta;

type Story = StoryObj<SptSearchDateTimeRangePickerProps>;

export const Default: Story = {
    name: 'SptSearchDatePicker',
    args: {
        label: '时间范围',
    },
    render: (args) => {
        return (
            <SptSearchDateTimeRangePicker {...args} />
        );
    }
};
