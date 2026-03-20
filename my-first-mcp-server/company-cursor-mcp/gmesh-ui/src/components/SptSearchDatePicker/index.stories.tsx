import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {SptSearchDatePicker, SptSearchDatePickerProps} from '.';
import dayjs from 'dayjs';

const meta = {
    title: 'Components/数据录入/SptSearchDatePicker',
    component: SptSearchDatePicker,
    tags: ['autodocs'],
    argTypes: {
        label: {
            description: '标签文本',
            type: 'string'
        }
    }
} satisfies Meta;

export default meta;

type Story = StoryObj<SptSearchDatePickerProps>;

/**
 * 基础日期选择器示例。
 * 
 * 可以通过 label 属性设置标签文本,通过 fieldProps 传递 DatePicker 的属性。
 * 
 * ```tsx
 * <SptSearchDatePicker label="日期" />
 * 
 * // 设置 DatePicker 属性
 * <SptSearchDatePicker 
 *   label="日期"
 *   fieldProps={{
 *     format: 'YYYY-MM-DD'
 *   }}
 * />
 * ```
 */
export const Default: Story = {
    name: '基础示例',
    args: {
        label: '日期',
    },
    render: (args) => {
        return (
            <SptSearchDatePicker {...args} />
        );
    }
};

/**
 * 自定义日期格式示例
 */
export const CustomFormat: Story = {
    name: '自定义格式',
    args: {
        label: '日期',
        fieldProps: {
            format: 'YYYY/MM/DD'
        }
    }
};

/**
 * 设置默认值示例
 */
export const WithDefaultValue: Story = {
    name: '默认值',
    args: {
        label: '日期',
        fieldProps: {
            defaultValue: dayjs()
        }
    }
};

/**
 * 禁用状态示例
 */
export const Disabled: Story = {
    name: '禁用状态',
    args: {
        label: '日期',
        fieldProps: {
            disabled: true
        }
    }
};

/**
 * 设置日期范围示例
 */
export const DateRange: Story = {
    name: '日期范围限制',
    args: {
        label: '日期',
        fieldProps: {
            disabledDate: (current: any) => {
                return current && current > dayjs().endOf('day');
            }
        }
    }
};
