import type { Meta, StoryObj } from '@storybook/react';
import Downgrade from '.';
import React from 'react';
import { withProxy } from '@/decorators/withGmesh';

const meta = {
    title: 'Components/反馈/Downgrade',
    tags: ['autodocs'],
    decorators: [withProxy],
    component: Downgrade.ClientError,
} satisfies Meta<typeof Downgrade.ClientError>;

export default meta;



export const DowngradeClientErrorStory: StoryObj<typeof Downgrade.ClientError>= {
    name: 'Downgrade ClientError',
    render: () => {
        return <Downgrade.ClientError error={new Error("Hello Error")} />
    }
}

export const DowngradeNotFoundStory: StoryObj<typeof Downgrade.NotFound>= {
    name: 'Downgrade NotFound',
    render: () => {
        return <Downgrade.NotFound />
    }
}


export const DowngradePermissionDeniedStory: StoryObj<typeof Downgrade.PermissionDenied>= {
    name: 'Downgrade PermissionDenied',
    render: () => {
        return <Downgrade.PermissionDenied />
    }
}

export const DowngradeServerErrorDeniedStory: StoryObj<typeof Downgrade.ServerError>= {
    name: 'Downgrade ServerError',
    render: () => {
        return <Downgrade.ServerError />
    }
}




