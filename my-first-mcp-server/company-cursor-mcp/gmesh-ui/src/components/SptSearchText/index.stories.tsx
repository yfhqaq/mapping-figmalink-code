import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {SptSearchText, SptSearchTextProps} from '.';

//👇 This default export determines where your story goes in the story list
const meta = {
    title: 'Components/数据录入/SptSearchText',
    tags: ['autodocs']
} satisfies Meta;

export default meta;

type Story = StoryObj<SptSearchTextProps>;

export const Default: Story = {
    name: 'SptSearchText',
    args: {
        label: '款项编号',
        // autoSearch: true,
        placeholder: '请输入款项编号',
        fieldProps: {
            placeholder: '请输入款项编号请输入款项编号请输入款项编号请输入款项编号',
        }
    },
    render: (args) => {
        return (
            <div style={{width: '220px'}}>
                <SptSearchText {...args} />
            </div>
        );
    }
};
