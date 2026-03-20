import { ConfigProvider as AntdConfigProvider } from 'antd';
import theme from '@spotter/design-token/lib/antdTheme.json';
import React, { ReactNode, useContext, useMemo } from 'react';
import { RouteObject } from 'react-router-dom';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
export type ConfigContextPropsType = {
    locale?: string;
    routes?: RouteObject[];
};

const antdI18n = {
    en: enUS,
    zh: zhCN,
};

export const SptComponentContext = React.createContext<ConfigContextPropsType>({
    locale: 'default',
    routes: [],
});

export const { Consumer: ConfigConsumer } = SptComponentContext;

export const SptComponentProvider: React.FC<{
    prefixCls?: string;
    routes?: RouteObject[];
    locale?: string;
    children?: ReactNode | undefined;
}> = ({ children, routes, locale }) => {
    const {
        pagination,
        locale: parentLocale,
        ...restConfig
    } = useContext(AntdConfigProvider.ConfigContext);
    const { routes: parentRoutes, ...otherProps } = useContext(SptComponentContext);
    const value = useMemo(() => {
        return {
            ...otherProps,
            routes: routes ?? parentRoutes ?? [],
            locale,
        };
    }, [parentRoutes, routes, otherProps, locale]);
    const paginationProps = useMemo(
        () => ({
            showSizeChanger: true,
            ...pagination,
        }),
        [pagination],
    );

    return (
        <AntdConfigProvider
            theme={theme}
            pagination={paginationProps}
            locale={parentLocale ?? antdI18n[(locale as keyof typeof antdI18n) ?? 'zh']}
            {...restConfig}
        >
            <SptComponentContext.Provider value={value}>{children}</SptComponentContext.Provider>
        </AntdConfigProvider>
    );
};
