import zh from './zh';
import en from './en';
import { useContext } from 'react';
import { ConfigProvider as AntdConfigProvider } from 'antd';

const getMessageFromObject = (
    obj: any,
    keys: string[],
    defaultText?: string,
): string | undefined => {
    if (keys.length === 0) {
        return defaultText;
    }
    const key = keys.shift();
    if (key) {
        if (obj[key] === undefined) {
            return defaultText;
        }
        if (typeof obj[key] === 'string') {
            return obj[key];
        }
        return getMessageFromObject(obj[key], keys, defaultText);
    }
    return defaultText;
};

export const useSptIntl = () => {
    const { locale } = useContext(AntdConfigProvider.ConfigContext);

    const getMessage = (i18nKey: string, defaultText?: string) => {
        const keys = i18nKey.split('.');
        const localeTag = locale?.locale?.toLowerCase();
        if (localeTag === 'zh-cn' || localeTag === 'zh' || localeTag === 'default') {
            return getMessageFromObject(zh, keys, defaultText);
        } else {
            return getMessageFromObject(en, keys, defaultText);
        }
    };

    const formatWithParams = (i18nKey: string, params?: object) => {
        let text = getMessage(i18nKey);

        if (params) {
            Object.keys(params).forEach((key) => {
                text = (text as string).replace(`{${key}}`, (params as any)[key]);
            });
        }
        return text;
    };

    return {
        getMessage,
        formatWithParams,
    };
};
