import { Spin, TabPaneProps, Typography } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { FC, ReactElement, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { pathJoin } from '@spotter/app-client-toolkit';
import classNames from 'classnames';
import SptTabs, { SptTabBadgeType } from '../SptTabs';
import { useStyles } from './style';
import SptFooterToolbar, { SptFooterToolbarProps } from '../SptFooterToolbar';
import { SptComponentProvider } from '../Provider';
import { ParagraphProps } from 'antd/es/typography/Paragraph';

export const SptPageContainerContext = React.createContext<{ tableAction?: ReactNode[] } | null>(
    null,
);

export const SptPageContainerProvider = SptPageContainerContext.Provider;

export interface InnerTabsProps {
    label: ReactNode;
    key: string;
    count?: number;
}

const { Paragraph } = Typography;

export interface SptPageContainerProps {
    /**
     * 页面标题
     */
    title?: ReactNode;
    /**
     * 页面副标题
     */
    subTitle?: ReactNode;
    /**
     * tab页签
     */
    tabs?: (TabPaneProps & { count?: number })[];
    /**
     * tab页签角标类型，默认为corner
     */
    tabBadgeType?: SptTabBadgeType;
    /**
     * 基础路径, 用于tab路由模式作为基础路径
     */
    basePath?: string;
    /**
     * header的额外区域
     */
    extra?: ReactElement;
    /**
     * 右侧操作区域
     */
    action?: ReactNode;
    /**
     * 表格操作区域，适用于列表页面，会自动将tableAction的内容放在接收表格的操作区域最右侧
     */
    tableAction?: ReactNode[];
    /**
     * 容器加载
     */
    loading?: boolean;
    /**
     * 底部工具栏，使用fixed操作固定在页面对底部，适用于编辑、新增页面
     */
    footerToolbar?: ReactNode | ReactNode[];
    /**
     * 底部工具栏的props
     */
    footerToolbarProps?: SptFooterToolbarProps;
    /**
     * 顶部插槽区域
     */
    topSection?: ReactNode;
    /**
     * Tab 路由模式, 默认为true， 为false时可关闭tab路由模式
     */
    tabNavigationMode?: boolean;
    /**
     * Tab 切换事件
     * @param activeTabKey
     * @returns
     */
    onTabChange?: (activeTabKey: string) => void;
    /**
     * 内容的布局适配容器
     */
    fitContainer?: boolean;
    /**
     * 自动默认tab key
     */
    autoDefaultTabKey?: boolean;
    showTitleEllipsis?: boolean;
    titleEllipsisRows?: number;
    titleProps?: Omit<ParagraphProps, 'ellipsis'>;
    children?: ReactNode | undefined;
    className?: string;
    style?: React.CSSProperties;
}

const SptPageContainerBase: FC<SptPageContainerProps> = ({
    title,
    subTitle,
    tabs = [],
    tabBadgeType = SptTabBadgeType.Corner,
    basePath = '',
    topSection,
    children = <Outlet />,
    extra,
    action,
    footerToolbar,
    footerToolbarProps,
    loading = false,
    tabNavigationMode = true,
    autoDefaultTabKey = true,
    fitContainer = false,
    tableAction,
    showTitleEllipsis = true,
    titleEllipsisRows = 1,
    titleProps,
    onTabChange,
    className,
    style,
}) => {
    const { styles } = useStyles();
    const innerTabs = useMemo(
        () =>
            tabs?.map((p) => ({
                label: p.tab,
                key: tabNavigationMode ? pathJoin(basePath, p.tabKey as string) : p.tabKey,
                count: p?.count,
            })) as InnerTabsProps[],
        [basePath, tabs, tabNavigationMode],
    );
    const location = useLocation();
    const navigate = useNavigate();

    const [activeKey, setActiveKey] = useState(
        tabNavigationMode ? location.pathname : innerTabs[0]?.key ?? undefined,
    );

    useEffect(() => {
        if (tabNavigationMode && location.pathname !== pathJoin('/', basePath)) {
            setActiveKey(location.pathname);
        } else {
            autoDefaultTabKey && innerTabs.length && setActiveKey(innerTabs[0].key);
        }
    }, [location.pathname, tabNavigationMode, innerTabs]);

    useEffect(() => {
        onTabChange?.(activeKey!);
    }, [activeKey]);
    const ref = useRef<HTMLDivElement>(null);

    const tableProvideAction = useMemo(() => {
        return {
            tableAction,
        };
    }, [activeKey, innerTabs, tabNavigationMode, basePath]);

    return (
        <SptPageContainerProvider value={tableProvideAction}>
            <div
                className={classNames(
                    {
                        'with-tabs': tabs?.length,
                        'fit-container': fitContainer,
                        'tab-navigation-mode': tabNavigationMode,
                        'spotter-page-container-fit-pagination': footerToolbar,
                    },
                    styles.container,
                    'spotter-page-container',
                    className,
                )}
                style={style}
                ref={ref}
            >
                {topSection}
                {(title || subTitle || action || extra) && (
                    <div className="spotter-page-container-title">
                        {(title || subTitle || action) && (
                            <div className="spotter-page-container-title-inner">
                                <div className="spotter-page-container-title-inner-wrap">
                                    {title ? (
                                        typeof title === 'string' ? (
                                            <Paragraph
                                                {...titleProps}
                                                ellipsis={
                                                    showTitleEllipsis
                                                        ? {
                                                              rows: titleEllipsisRows,
                                                              tooltip: {
                                                                  title: title,
                                                              },
                                                          }
                                                        : undefined
                                                }
                                                className={classNames(
                                                    'spotter-page-container-title-main',
                                                    titleProps?.className,
                                                )}
                                                style={{
                                                    verticalAlign: 'middle',
                                                    overflow: 'hidden',
                                                    padding: 0,
                                                    margin: 0,
                                                    ...titleProps?.style,
                                                }}
                                            >
                                                {title}
                                            </Paragraph>
                                        ) : (
                                            <div
                                                className="spotter-page-container-title-main"
                                                style={{
                                                    verticalAlign: 'middle',
                                                    overflow: 'hidden',
                                                    padding: 0,
                                                    margin: 0,
                                                    ...titleProps?.style,
                                                }}
                                            >
                                                {title ?? '-'}
                                            </div>
                                        )
                                    ) : null}
                                    {subTitle ? (
                                        <div className="spotter-page-container-title-sub">
                                            {subTitle}
                                        </div>
                                    ) : null}
                                </div>
                                {action ? (
                                    <div className="spotter-page-container-title-action">
                                        {action}
                                    </div>
                                ) : null}
                            </div>
                        )}
                        {extra}
                    </div>
                )}
                {innerTabs && innerTabs?.length ? (
                    <SptTabs
                        className="spotter-page-container-tabs"
                        activeKey={activeKey}
                        onChange={(key) => {
                            setActiveKey(key);
                            tabNavigationMode && navigate(key);
                        }}
                        items={innerTabs.map((item, i) => ({
                            label: tabs[i].tab,
                            key: tabNavigationMode ? item.key : (tabs[i].tabKey as string),
                            count: item?.count,
                        }))}
                        badgeType={tabBadgeType}
                        tabBarGutter={24}
                    />
                ) : null}

                <Spin style={{ height: '' }} spinning={loading}>
                    {children}
                </Spin>
                {footerToolbar ? (
                    <SptFooterToolbar {...footerToolbarProps}>{footerToolbar}</SptFooterToolbar>
                ) : null}
            </div>
            {footerToolbar && <div className={styles.footerPlaceholder} />}
        </SptPageContainerProvider>
    );
};

const SptPageContainer: FC<SptPageContainerProps> = ({ ...props }) => {
    return (
        <SptComponentProvider>
            <SptPageContainerBase {...props} />
        </SptComponentProvider>
    );
};

export default SptPageContainer;
