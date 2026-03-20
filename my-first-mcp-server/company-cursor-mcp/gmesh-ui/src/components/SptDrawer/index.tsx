import { Drawer, DrawerProps, Spin, Tabs, TabsProps, Typography } from 'antd';
import React, {
    FC,
    ReactElement,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import SptIcon from '../SptIcon';
import { SptComponentProvider } from '../Provider';
import qs from 'qs';
import updateSearchParams from '@/utils/updateSearchParams';
import Omit from 'omit.js';
import { useRefFunction } from '@ant-design/pro-components';
import { useTabOnHide, useTabOnShow } from '@spotter/app-client-toolkit';
import { createStyles } from 'antd-style';

/**
 * SptDrawer组件的属性接口
 * @extends {Omit<DrawerProps, 'children' | 'title' | 'closable' | 'closeIcon' | 'extra' | 'action' | 'visible'>}
 */
export interface SptDrawerProps
    extends Omit<
        DrawerProps,
        'children' | 'title' | 'closable' | 'closeIcon' | 'extra' | 'action' | 'visible'
    > {
    /**
     * 顶级内容区
     */
    topSection?: ReactNode;

    /**
     * 头部主标题区
     */
    title?: ReactNode;

    /**
     * 头部次级标题区
     */
    subTitle?: ReactNode;

    /**
     * 头部附加区
     */
    extra?: ReactElement;

    /**
     * 头部操作区
     */
    action?: ReactNode;

    /**
     * 主内容区
     * @remarks children 和 tabs 的 children 两者是不同的使用模式，只允许同时使用一个，否则会出现非预期的样式冲突
     */
    children?: ReactNode;

    /**
     * tab items 数据源
     * @remarks 主内容区的 children 和 tabs 的 children 两者是不同的使用模式，只允许同时使用一个，否则会出现非预期的样式冲突
     */
    tabs?: TabsProps['items'];

    /**
     * 受控激活的 tabKey
     */
    activeTabKey?: string;

    /**
     * 非受控默认的 tabKey
     */
    defaultTabKey?: string;

    /**
     * tab切换是否刷新界面
     */
    destroyInactiveTabPane?: boolean;

    /**
     * 点击白名单选择器列表
     */
    whiteList?: string[];

    /**
     * 容器加载中动画
     */
    loading?: boolean;

    /**
     * 关闭抽屉的回调函数
     * @remarks
     * onClose 的触发逻辑:
     * 1. 如果点击在抽屉内则直接返回，否则进入 2
     * 2. 如果点击在黑名单的选择器内则执行 onClose，否则进入 3
     * 3. 如果点击在白名单(白名单详情看源码 inBoundSelectorWhiteList 变量)的选择器内则直接返回，否则进入 4
     * 4. 执行 onClose
     */
    onClose: () => void;
}

export type SptDrawerContainerProps<Payload = any> = Pick<SptDrawerProps, 'open' | 'onClose'> &
    Payload;
const { Paragraph } = Typography;

export const DRAWER_PERSIST = 'drawerPersist';
// 出界点击的选择器白名单，匹配到的选择器都不会在点击事件发生时关闭抽屉
const inBoundSelectorWhiteList = ['.ant-table', '.spotter-layout-header', '.ant-drawer-footer'];

const motion: DrawerProps['motion'] = {
    visible: true,
};

const useStyles = createStyles(({ token }) => ({
    drawer: {
        top: 'var(--spt-drawer-top, 40px)',
        zIndex: 100,
        height: 'calc(100% - var(--spt-drawer-top, 40px))',
        border: 'none',
        outline: 'none',

        '&.ant-drawer-inline': {
            position: 'fixed',
        },

        '.ant-drawer-content-wrapper': {
            zIndex: 99,
            boxShadow: `0px 0px 16px rgba(0, 0, 0, 0.04),
                       0px 2px 8px rgba(0, 0, 0, 0.08)`,
            borderTopLeftRadius: token.borderRadiusLG,
            '> .ant-drawer-content': {
                borderTopLeftRadius: token.borderRadiusLG,
            },
        },

        '.spotter-drawer-container': {
            position: 'relative',
            overflow: 'visible',

            '.ant-drawer-header': {
                display: 'none',
            },

            '.spotter-drawer-close-icon': {
                position: 'absolute',
                top: 20,
                left: -12,
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 24,
                height: 24,
                cursor: 'pointer',
                color: '#949EB9',
                '&:hover': {
                    color: '#717A98',
                },

                '> .sptfont::after': {
                    position: 'absolute',
                    top: 1.5,
                    left: 1.5,
                    zIndex: -1,
                    display: 'block',
                    width: 21,
                    height: 21,
                    background: '#fff',
                    borderRadius: 12,
                    content: '""',
                },
            },

            '.ant-drawer-body': {
                padding: 0,

                '> .spotter-drawer-ref-wrapper': {
                    height: '100%',
                    padding: '12px 2px 8px 24px',
                    overflow: 'visible',

                    '> .ant-spin-nested-loading': {
                        height: '100%',

                        '> .ant-spin-container': {
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%',

                            '> .spotter-drawer-container-title': {
                                display: 'flex',
                                flexDirection: 'column',
                                paddingRight: 16,
                                marginBottom: 8,

                                '&.with-tab-children': {
                                    height: '100%',

                                    '.spotter-drawer-tabs': {
                                        marginTop: 12,
                                        '.ant-tabs-nav': {
                                            marginRight: 16,
                                        },
                                        '.ant-tabs-content-holder': {
                                            paddingRight: 16,
                                        },
                                    },
                                },

                                '.spotter-drawer-container-title-row': {
                                    display: 'flex',
                                    alignItems: 'center',
                                },

                                '.spotter-drawer-container-title-row-inner': {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flex: '1 1 0',
                                    height: '100%',
                                    justifyContent: 'center',
                                    '.spotter-drawer-container-title-row-inner-left': {
                                        display: 'flex',
                                        alignItems: 'center',
                                    },
                                },

                                '.spotter-drawer-container-title-text': {
                                    flexGrow: 1,
                                    fontSize: '20px',
                                    lineHeight: '28px',
                                    fontWeight: 600,
                                    minHeight: 28,
                                    marginBottom: 0,
                                },

                                '.spotter-drawer-container-title-subtext': {
                                    flexGrow: 1,
                                    flex: '1 1 0',
                                    marginTop: 4,
                                    color: 'rgba(107, 114, 128)',
                                },

                                '.spotter-drawer-container-title-action': {
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginLeft: 24,
                                    flexWrap: 'wrap',
                                },
                            },

                            '> .spotter-drawer-container-content': {
                                display: 'flex',
                                flexDirection: 'column',
                                flexGrow: 1,
                                height: 0,
                                paddingRight: 16,
                                overflow: 'auto',
                                overflowX: 'hidden',
                            },
                        },
                    },
                },
            },
        },
    },
}));

const SpotterDrawerBase: FC<SptDrawerProps> = ({
    children,
    title,
    subTitle,
    topSection,
    tabs,
    activeTabKey,
    defaultTabKey,
    destroyInactiveTabPane,
    action,
    extra,
    loading = false,
    open = false,
    whiteList = [],
    maskClosable = true,
    onClose,
    className,
    rootClassName,
    ...drawerProps
}) => {
    const { styles } = useStyles();
    const [activeKey, setActiveKey] = useState(activeTabKey ?? defaultTabKey ?? tabs?.[0]?.key);
    const clickNotInDrawer = useRef<boolean | null>(null);

    const outboundClickHandler = useRefFunction((e: MouseEvent) => {
        if (!maskClosable) return;
        // 如果点击区域在 drawer 内部，则直接 skip
        if (clickNotInDrawer.current !== null && !clickNotInDrawer.current) {
            clickNotInDrawer.current = null;
            return;
        }

        // 如果点击区域不在应用 dom 下面，说明是动态插入的浮层 dom，则直接 skip
        if (!document.querySelector('#main-application')?.contains(e.target as any)) {
            return;
        }

        // 如果点击 drawer 外部的区域在白名单里，则 skip，否则执行关闭 drawer
        const inBound = [...inBoundSelectorWhiteList, ...whiteList].some((selector: string) => {
            const nodeList = document.querySelectorAll(selector);
            return [...nodeList].some((node) => node.contains(e.target as any));
        });
        if (!inBound) {
            onClose?.();
        }
    });

    const subscribeClickEvent = () => {
        window.addEventListener('click', outboundClickHandler);
    };

    const unsubscribeClickEvent = () => {
        window.removeEventListener('click', outboundClickHandler);
    };

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                // 防止被点击事件立即执行（兼容single-SPA）
                subscribeClickEvent();
            }, 0);
        } else {
            unsubscribeClickEvent();
        }
    }, [open]);

    useTabOnShow(() => {
        if (!open) return;
        subscribeClickEvent();
    });

    useTabOnHide(() => {
        if (!open) return;
        unsubscribeClickEvent();
    });

    useEffect(() => {
        return () => {
            unsubscribeClickEvent();
        };
    }, []);

    useEffect(() => {
        setActiveKey(activeTabKey);
    }, [activeTabKey]);

    return (
        <Drawer
            width="calc(75vw - 56px)"
            className={classNames('spotter-drawer-container', className)}
            rootClassName={classNames(styles.drawer, 'spotter-drawer', rootClassName)}
            open={open}
            motion={motion}
            closeIcon={null}
            // 只在 focus 到抽屉本体时有效，疑似 bug
            keyboard={false}
            mask={false}
            onClose={onClose}
            destroyOnClose
            // getContainer="#main-application"
            getContainer={false}
            {...drawerProps}
        >
            <div className="spotter-drawer-close-icon" onClick={onClose}>
                <SptIcon size={'24px'} type="sptfont-drawerClose" />
            </div>
            <div
                onClick={() => {
                    clickNotInDrawer.current = false;
                }}
                className="spotter-drawer-ref-wrapper"
            >
                <Spin spinning={loading}>
                    {topSection}
                    {(title || subTitle || action || extra || tabs?.length) && (
                        <div
                            className={classNames('spotter-drawer-container-title', {
                                // 当不存在 children 时
                                'with-tab-children': !children,
                            })}
                        >
                            {(title || subTitle || action) && (
                                <div className="spotter-drawer-container-title-row">
                                    <div className="spotter-drawer-container-title-row-inner">
                                        <div className="spotter-drawer-container-title-row-inner-left">
                                            {typeof title === 'string' ? (
                                                <Paragraph
                                                    className="spotter-drawer-container-title-text"
                                                    ellipsis={{
                                                        tooltip: title,
                                                        rows: 3,
                                                        // fix: 设置此属性触发antd源码中需要动态计算的判断
                                                        suffix: '',
                                                    }}
                                                >
                                                    {title ?? '-'}
                                                </Paragraph>
                                            ) : (
                                                <div className="spotter-drawer-container-title-text">
                                                    {title ?? '-'}
                                                </div>
                                            )}
                                            {action ? (
                                                <div className="spotter-drawer-container-title-action">
                                                    {action}
                                                </div>
                                            ) : null}
                                        </div>
                                        {subTitle ? (
                                            <div className="spotter-drawer-container-title-subtext">
                                                {subTitle ?? '-'}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            )}
                            {extra}
                            {tabs?.length ? (
                                <div className="spotter-drawer-tabs">
                                    <Tabs
                                        size="small"
                                        items={tabs}
                                        activeKey={activeKey as string}
                                        destroyInactiveTabPane={destroyInactiveTabPane}
                                        onChange={(key) => {
                                            setActiveKey(key);
                                        }}
                                    />
                                </div>
                            ) : null}
                        </div>
                    )}
                    <div className="spotter-drawer-container-content">{children}</div>
                </Spin>
            </div>
        </Drawer>
    );
};

export function useDrawerOpen<Data extends Record<string, any>>(
    initialData = {} as {
        // 初始化 open 值，persist 时不生效
        open?: boolean;
        // 初始化 payload 值，persist 时不生效
        payload?: Data;
        /**
         * 持久/留存模式，用来支持刷新浏览器后自动打开抽屉的场景
         * 当传入该 key 时，会让 SpotterDrawer 组件在初始化时优先从 searchParams 继承 open 状态
         * 请注意，不要同时传入初始化 open 值 和 使用 persist 模式，如果同时使用了，persist 模式会生效而忽略初始化 open 值
         */
        persist?: boolean;
    },
): {
    open: boolean;
    payload: Data;
    updateDrawer: (open: boolean, payload?: Data) => void;
} {
    const [searchParams] = useSearchParams();
    const initialPersist = useRef(initialData.persist ?? true);
    const originParams = useRef(searchParams.toString());
    const [data, setData] = useState<any>({
        open: initialPersist.current ? searchParams.has(DRAWER_PERSIST) : initialData.open ?? false,
        ...(initialPersist.current
            ? (qs.parse(searchParams.toString()) as Data)
            : initialData.payload ?? ({} as Data)),
    });

    const updateDrawer = useCallback((newOpen: boolean, newData?: Data) => {
        if (newOpen) {
            // 如果抽屉打开，记录当前状态
            originParams.current = searchParams.toString();
        }
        // 在传入 persistKey 的前提下进入 open 状态时，同步 persistKey 到 searchParams
        setData({ open: newOpen, ...newData });

        const newSearchParams = {
            ...newData,
            ...(newOpen ? { [DRAWER_PERSIST]: newOpen.toString() } : {}),
        };

        updateSearchParams(newSearchParams);
    }, []);

    useEffect(() => {
        if (data && searchParams) {
            if (data?.open) return; // 已经打开的抽屉就不要去操作了
            const keys = Object.keys(data);
            if (keys.length === 0) {
                return;
            }
            const params = qs.parse(originParams.current);
            const originParamsKeys = Array.isArray(params) ? params : Object.keys(params ?? {});
            const parasedData = Omit(data, ['open', ...originParamsKeys]) as Record<string, any>;

            if (keys.some((key) => searchParams.get(key) !== parasedData[key])) {
                setData({
                    open: searchParams.has(DRAWER_PERSIST),
                    ...(qs.parse(searchParams.toString()) as Data),
                });
            } else {
                setData({
                    open: searchParams.has(DRAWER_PERSIST),
                    ...data,
                });
            }
        }
    }, [searchParams]);

    return useMemo(
        () => ({
            open: data.open,
            payload: data,
            updateDrawer,
        }),
        [data],
    );
}

export const getDrawerUrl = (path: string, payload: Record<string, any>) => {
    const searchParams = new URLSearchParams();
    for (const key of Object.keys(payload)) {
        searchParams.set(key, payload[key]);
    }
    // 自动添加弹窗持久化参数，跳转后自动打开
    searchParams.set(DRAWER_PERSIST, 'true');
    return `${path}?${searchParams.toString()}`;
};

/**
 * 详情抽屉组件
 * @param props
 * @returns
 */
const SptDrawer: FC<SptDrawerProps> = (props) => {
    return (
        <SptComponentProvider>
            <SpotterDrawerBase {...props} />
        </SptComponentProvider>
    );
};

export default SptDrawer;
