import { ProTable, ProTableProps } from '@ant-design/pro-components';
import classnames from 'classnames';
import React, { memo, useCallback, useMemo, useRef } from 'react';
import { ScrollBodyWrapper, StickyScrollbar } from './StickyScrollbar';

// 元素名称抽屉触发黑名单，点击在此列表中的元素时不会触发抽屉
const NODE_NAME_BLACK_LIST_DRAWER_TRIGGER = new Set(['A']);

export interface TableProps<DataSource, U, ValueType = 'text'>
    extends ProTableProps<DataSource, U, ValueType> {
    width?: string | number | true;
    fitClass?: string;
    ResizingHeaderCell?: any;
    cacheKeyWithRoute?: string;
    scrollY?: string;
    /**
     * 当选中了某段文字时触发
     */
    onRowSelection?: (
        selection: ReturnType<typeof document.getSelection>,
        event: React.MouseEvent<any, MouseEvent>,
    ) => void;
    /**
     * @param open
     * @param record
     * @description 除了下述情况，点击行时会执行该回调函数
     * 1. 选中了某段文字
     * 2. 点击的元素是 a 标签
     */
    onRowDrawerChange?: (open: boolean, record: DataSource) => void;
    ResizingIndicator?: any;
    /**
     * 适配模式
     * - auto: 自动适配，基于视窗高度 1080px 来启用不同的适配规则。
     * - content: 适配内容，即内容的高度优先，不设限制，表现为在溢出视窗高度的内容部分使用 sticky 模式下在 PageContainer 中滚动。
     * - container: 适配容器，即 table 容器的高度固定，内容溢出 table 容器的部分在 table body 内部滚动。
     * - none: 使用原始的 table 模式，不进行任何适配。
     */
    fit?: 'auto' | 'content' | 'container' | 'none';
    componentId: string;
}

function Table<DataSource, U, ValueType = 'text'>({
    className,
    width,
    fit,
    fitClass,
    sticky,
    columns,
    cacheKeyWithRoute,
    onRow,
    onRowSelection,
    onRowDrawerChange,
    ResizingHeaderCell,
    components: originComponents,
    ResizingIndicator,
    scrollY,
    pagination,
    componentId: _componentId,
    ...restProps
}: TableProps<DataSource, U, ValueType>) {
    const spotterTableWrapperRef = useRef<any>();

    // eslint-disable-next-line react/no-unstable-nested-components
    const tableViewRender = useCallback(
        (_: any, defaultDom: JSX.Element) => (
            <div
                id={_componentId}
                className={classnames('spotter-table-wrapper', {
                    'with-pagination': pagination === undefined ? true : pagination,
                    // 'with-pagination': true,
                })}
                ref={(dom) => {
                    spotterTableWrapperRef.current = dom;
                }}
            >
                {defaultDom}
                <ResizingIndicator id={_componentId} />
                <StickyScrollbar
                    id={_componentId}
                    getContainer={() =>
                        spotterTableWrapperRef.current?.querySelector(
                            '.ant-table-wrapper >.ant-spin-nested-loading >.ant-spin-container >.ant-table',
                        ) || document.body
                    }
                />
            </div>
        ),
        [ResizingIndicator, _componentId],
    );

    // 预置参数.
    const spotterTablePresetProps: ProTableProps<any, any, any> = useMemo(
        () => ({
            className: classnames(className, fitClass, 'spotter-table'),
            sticky,
            scroll: {
                y: scrollY,
                x: width,
                scrollToFirstRowOnChange: true,
            },
            options: false,
            size: 'small',
            onRow: (record) => {
                const eventHandlers = onRow?.(record);
                return {
                    ...eventHandlers,
                    onClick: (e) => {
                        // 选中时不触发展开，并取消开放状态
                        if (document.getSelection()?.toString()) {
                            onRowSelection?.(document.getSelection(), e);
                        } else {
                            !NODE_NAME_BLACK_LIST_DRAWER_TRIGGER.has(
                                (e.target as HTMLElement).nodeName,
                            ) && onRowDrawerChange?.(true, record);
                        }
                        eventHandlers?.onClick?.(e);
                    },
                };
            },
            // eslint-disable-next-line react/no-unstable-nested-components
            tableViewRender,
        }),
        [
            className,
            width,
            sticky,
            fitClass,
            fit,
            onRowDrawerChange,
            onRowSelection,
            cacheKeyWithRoute,
            scrollY,
        ],
    );

    const componentHeader = useMemo(
        () => ({
            ...originComponents?.header,
            cell: ResizingHeaderCell,
        }),
        [originComponents, ResizingHeaderCell],
    );
    const componentBody = useMemo(
        () => ({
            ...originComponents?.body,
            // eslint-disable-next-line react/no-unstable-nested-components
            wrapper: (props: any) => <ScrollBodyWrapper id={_componentId} {...props} />,
        }),
        [originComponents, _componentId],
    );

    return (
        <ProTable
            // TODO: 处理类型报错的问题
            {...(restProps as any)}
            {...spotterTablePresetProps}
            // 关闭默认的搜索、分页功能，解决搜索和分页功能导致延迟的问题,避免不必要的刷新率
            search={false}
            pagination={false}
            loading={false}
            columns={columns}
            components={{
                table: originComponents?.table,
                header: componentHeader,
                body: componentBody,
            }}
        />
    );
}

export default memo(Table);
