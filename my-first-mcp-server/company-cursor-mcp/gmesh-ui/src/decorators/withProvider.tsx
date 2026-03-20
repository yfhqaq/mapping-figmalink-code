import React from 'react';
import { makeDecorator } from '@storybook/preview-api';
import { SptComponentProvider } from '@/components/Provider';

export const withProvider = makeDecorator({
    name: 'withProvider',
    parameterName: 'providerParams',
    wrapper: (story: (...args: any[]) => unknown, context, { parameters = {} }) => {
        return (
            <SptComponentProvider {...parameters}>
                {story(context) as React.ReactNode}
            </SptComponentProvider>
        );
    },
});
