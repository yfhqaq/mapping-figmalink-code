import type { Meta, StoryObj } from '@storybook/react';
import SptBrand from '.';
import React from 'react';
// TODO: 完善Brand相关文档
const meta = {
    title: 'Components/品牌/Brand',
    tags: ['autodocs'],
    component: SptBrand.Copyright,
} satisfies Meta<typeof SptBrand.Copyright>;

export default meta;

export const BrandCopyrightStory: StoryObj<typeof SptBrand.Copyright> = {
    name: 'Brand Copyright',
    render: () => {
        return <SptBrand.Copyright />
    }
}

export const brandLogoStory: StoryObj<typeof SptBrand.Logo> = {
    name: 'Brand Logo',
    args: {},
    render: ({...args}) => {
        return <div style={{ width: 120 }}><SptBrand.Logo {...args} /></div>
    }
}
