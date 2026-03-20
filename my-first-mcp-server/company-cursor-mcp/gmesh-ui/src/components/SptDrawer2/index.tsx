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
import useStyle from './style';
import Omit from 'omit.js';
import { useRefFunction } from '@ant-design/pro-components';
import { useTabOnHide, useTabOnShow } from '@spotter/app-client-toolkit';

/**
 * 共度版本
 */
export interface SptDrawerProps
    extends Omit<
        DrawerProps,
        'children' | 'title' | 'closable' | 'closeIcon' | 'extra' | 'action' | 'visible'
    > {
    /**
     * 顶部插槽
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
     * 主内容区，children 和 tabs 的 children 两者是不同的使用模式，只允许同时使用一个，否则会出现非预期的样式冲突
     */
    children?: ReactNode;

    /**
     * Tabs 先关
     */
    // tab items 数据源， 主内容区的 children 和 tabs 的 children 两者是不同的使用模式，只允许同时使用一个，否则会出现非预期的样式冲突
    tabs?: TabsProps['items'];
    // 受控 激活的 tabKey
    activeTabKey?: string;
    // 非受控  默认的 tabKey
    defaultTabKey?: string;
    // tab切换刷新界面
    destroyInactiveTabPane?: boolean;
    whiteList?: string[];
    /**
     * 容器加载中动画
     */
    loading?: boolean;
    // @TODO 未来预计支持 5 档的尺寸
    // size?: 'lg
    /**
     * 关闭抽屉钩子
     * onClose 的触发逻辑
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

export const DRAWER_SEARCH_KEY = 'DRAWER_SEARCH_PARAMS';
export const DRAWER_PERSIST = 'drawerPersist';
// 出界点击的选择器白名单，匹配到的选择器都不会在点击事件发生时关闭抽屉
const inBoundSelectorWhiteList = ['.ant-table', '.spotter-layout-header', '.ant-drawer-footer'];

const motion: DrawerProps['motion'] = {
    visible: true,
};

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
    maskClosable = true,
    onClose,
    whiteList = [],
    className,
    rootClassName,
    ...drawerProps
}) => {
    const { styles } = useStyle();
    const [activeKey, setActiveKey] = useState(activeTabKey ?? defaultTabKey ?? tabs?.[0]);
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
            className={classNames(styles.container, className)}
            rootClassName={classNames('spotter-drawer', styles.drawer, rootClassName)}
            open={open}
            motion={motion}
            closeIcon={null}
            keyboard={false}
            mask={false}
            onClose={onClose}
            destroyOnClose
            getContainer={false}
            {...drawerProps}
        >
            <div className={styles.closeIcon} onClick={onClose}>
                <SptIcon size={'24px'} color="#949EB9" type="sptfont-drawerClose" />
            </div>
            <div
                onClick={() => {
                    clickNotInDrawer.current = false;
                }}
                className={styles.refWrapper}
            >
                <Spin spinning={loading}>
                    {topSection}
                    {(title || subTitle || action || extra || tabs?.length) && (
                        <div
                            className={classNames(styles.title, {
                                'with-tab-children': !children,
                            })}
                        >
                            {(title || subTitle || action) && (
                                <div className={styles.titleRow}>
                                    <div className={styles.titleRowInner}>
                                        <div className={styles.titleRowInnerLeft}>
                                            <Paragraph
                                                className={styles.titleText}
                                                ellipsis={{
                                                    tooltip: title,
                                                    rows: 3,
                                                    // fix: 设置此属性触发antd源码中需要动态计算的判断
                                                    suffix: '',
                                                }}
                                            >
                                                {title ?? '-'}
                                            </Paragraph>
                                            <div className={styles.titleAction}>{action}</div>
                                        </div>
                                        {subTitle ? (
                                            <div className={styles.titleSubText}>
                                                {subTitle ?? '-'}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            )}
                            {extra}
                            {tabs?.length ? (
                                <div className={styles.tabs}>
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
                    <div className={styles.content}>{children}</div>
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
    const [searchParams, setSearchParams] = useSearchParams();
    const initialPersist = useRef(initialData.persist ?? true);
    const getDrawerData = () => {
        const paramsString = searchParams.get(DRAWER_SEARCH_KEY) as string;
        try {
            return JSON.parse(paramsString) as Data;
        } catch (error) {
            return null;
        }
    };

    /**
     * 读取 Payload 数据
     * @returns
     */

    const getPayload = () => {
        const payload = getDrawerData();
        if (!payload) return null;

        delete payload[DRAWER_PERSIST];
        return payload;
    };

    /**
     * 设置抽屉的数据显示在URL查询参数中。
     *
     * 此函数用于根据抽屉数据更新URL的查询参数，以便于数据的传递和页面状态的恢复。
     * 如果抽屉数据不存在，则移除相应的查询参数；如果存在，则更新查询参数。
     *
     * @param {Data} drawerData - 抽屉的数据对象，包含需要显示在抽屉中的信息。
     * @returns {void}
     */
    const setDrawerData = (drawerData?: any) => {
        const params = drawerData ? JSON.stringify(drawerData) : null;
        if (!params) {
            searchParams.delete(DRAWER_SEARCH_KEY);
            setSearchParams(searchParams);
            return;
        }
        searchParams.set(DRAWER_SEARCH_KEY, params);
        setSearchParams(searchParams);
    };

    const getPersist = () => {
        const params = getDrawerData();
        if (!params) return false;
        return DRAWER_PERSIST in params;
    };

    const [data, setData] = useState<any>({
        open: initialPersist.current ? getPersist() : initialData.open ?? false,
        ...(initialPersist.current ? getDrawerData() : initialData.payload ?? ({} as Data)),
    });

    /**
     * 更新抽屉的状态和数据
     */
    const updateDrawer = useCallback((newOpen: boolean, newData?: Data) => {
        // 在传入 persistKey 的前提下进入 open 状态时，同步 persistKey 到 searchParams
        setData({ open: newOpen, ...newData });

        const newSearchParams = {
            ...newData,
            ...(newOpen ? { [DRAWER_PERSIST]: newOpen.toString() } : {}),
        };

        setDrawerData(newData ? newSearchParams : null);
    }, []);

    useEffect(() => {
        // 如果路由发生变化，将路由的数据更新到抽屉的state，使数据双向同步

        // 情形1，抽屉被打开了，但是数据没了，这个时候需要关闭抽屉
        const params = getPayload();
        if (!params && data.open) {
            // 抽屉数据被清除或者变更与抽屉无关
            setData({
                open: false,
            });
        } else if (params && !data.open) {
            // 2，抽屉没有打开，但是数据已经有了
            setData({
                open: true,
                ...params,
            });
        } else if (params && data.open) {
            // 3. 抽屉已经打开，参数变更，需要更新参数
            setData({
                open: true,
                ...params,
            });
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
    // 自动添加弹窗持久化参数，跳转后自动打开
    const params = {
        ...payload,
        [DRAWER_PERSIST]: 'true',
    };
    return `${path}?${DRAWER_SEARCH_KEY}=${encodeURIComponent(JSON.stringify(params))}`;
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
