import React from 'react';
import { makeDecorator } from '@storybook/preview-api';
import { EnableScope, getAppBootData, proxy, useMount } from '@spotter/app-client-toolkit';

// 解决重复加载的问题
let proxyConfigured = false;

export const withProxy = makeDecorator({
    name: 'withProxy',
    parameterName: 'netHijack',
    wrapper: (story: (...args: any[]) => unknown, context, { parameters = {} }) => {
        const { xApp, xTagHead } = parameters;
        useMount(() => {
            if (proxyConfigured) {
                return;
            }
            proxy({
                enableScope: [EnableScope.XHR, EnableScope.FETCH],
                async beforeRequest(config) {
                    if (config.url.startsWith(getAppBootData().appApiUrl)) {
                        config.headers['x-app'] = xApp ?? getAppBootData().appCode;
                        if (getAppBootData().apiTag || xTagHead) {
                            config.headers['x-tag-header'] = xTagHead ?? getAppBootData().apiTag!;
                        }
                        // getAppBootData('app').apiTag && ();
                    }
                    return config;
                },
                async afterResponse(config) {
                    return config;
                },
            });
            proxyConfigured = true;
        });

        return story(context) as React.ReactNode;
    },
});
