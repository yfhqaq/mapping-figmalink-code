import type { Meta, StoryObj } from '@storybook/react';
import SptLink from '.';
import React from 'react';

//👇 This default export determines where your story goes in the story list
const meta = {
    title: 'Components/导航/SptLink',
    component: SptLink,
    tags: ['autodocs'],
} satisfies Meta<typeof SptLink>;

export default meta;

type Story = StoryObj<typeof SptLink>;

export const Default: Story = {
    render: () => <SptLink to="https://gmesh.spotterio.com">跳转到Gmesh去</SptLink>
};
