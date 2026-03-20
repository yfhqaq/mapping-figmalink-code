import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import type { SptTableColumn } from './index';
import { eventBus } from '@spotter/app-client-toolkit';
import { clearSelection, toFloat } from './utils';

const getResizingEvent = (id: string) => `${id}_resizing`;

const ResizingHeaderCell = (props: any) => {
    const {
        onResizeStart,
        width,
        onResizeStop,
        OriginHeaderCell,
        children: overrideChildren,
        ...restProps
    } = props;
    const nodeRef = useRef<any>();
    const thNodeRef = useRef<any>();
    useEffect(() => {
        // 使用选择器，获取所有拖动按钮的 Dom 对象
        for (const elem of document.querySelectorAll(
            '.spotter-table-header-column-resize-trigger',
        )) {
            if ((elem as HTMLSpanElement).onclick) {
                return;
            }
            (elem as HTMLSpanElement).addEventListener('click', (event: MouseEvent) => {
                // 阻止冒泡
                event.stopPropagation();
                return false;
            });
        }
    }, []);
    // 没有原始宽度的列，不支持伸缩；会出现从自适应宽度一下子跳到拖动位置；也可以自行增加参数，如 disableResize
    if (!width) {
        return (
            <th {...props}>
                {OriginHeaderCell ? (
                    <OriginHeaderCell {...props}>{overrideChildren}</OriginHeaderCell>
                ) : (
                    overrideChildren
                )}
            </th>
        );
    }

    return (
        <th
            {...restProps}
            ref={(dom) => {
                dom && (thNodeRef.current = dom);
            }}
        >
            <span
                className="inline-block whitespace-pre-line"
                style={{ wordBreak: 'break-word' }}
                ref={(dom) => {
                    dom && (nodeRef.current = dom);
                }}
            >
                {overrideChildren}
            </span>
            <div
                onMouseDown={(triggerMouseDownEvent) => {
                    clearSelection();
                    const triggerRect = (
                        triggerMouseDownEvent.target as HTMLDivElement
                    ).getBoundingClientRect();
                    // 鼠标相对指示器的偏移量
                    const mouseOffsetX = toFloat(
                        triggerMouseDownEvent.clientX - (triggerRect.x + triggerRect.width * 0.5),
                    );
                    window.addEventListener(
                        'mouseup',
                        (e: MouseEvent) => {
                            e.stopPropagation();
                            // +1 for ::before 1px width
                            const _triggerRect = (
                                triggerMouseDownEvent.target as HTMLDivElement
                            ).getBoundingClientRect();
                            onResizeStop(
                                // 鼠标的 x 轴坐标 - 鼠标相对指示器的偏移量 = 指示器的 x 轴坐标
                                toFloat(e.clientX - mouseOffsetX) -
                                    toFloat(_triggerRect.x + 0.5 * _triggerRect.width),
                                toFloat(_triggerRect.x + 0.5 * _triggerRect.width),
                            );
                        },
                        { once: true },
                    );
                    onResizeStart(
                        (thNodeRef.current as HTMLSpanElement).getBoundingClientRect(),
                        (nodeRef.current as HTMLSpanElement).getBoundingClientRect(),
                        (triggerMouseDownEvent.target as HTMLDivElement).getBoundingClientRect(),
                    );
                }}
                className="spotter-table-header-column-resize-trigger"
            />
        </th>
    );
};

const ResizingIndicator = ({ id }: { id: string }) => {
    // 指示器 dom 节点
    const indicatorRef = useRef<any>();
    const resizingRef = useRef<{
        inResizing: boolean;
        boundary: number;
        startX: number;
        // resizing 时鼠标相对指示器的偏移量，用来保证在鼠标移动的过程中指示器和鼠标始终保持最开始的相对偏移量，从而不会导致指示器位置闪烁。
        startMouseOffsetX: number;
        // 指示器 x 轴相对视窗的偏移量，用来参与计算 transform 值
        offsetX: number;
    }>({
        inResizing: false,
        boundary: 0,
        startX: 0,
        startMouseOffsetX: 0,
        offsetX: 0,
    });

    const onDrag = useCallback(
        (e: MouseEvent) => {
            if (resizingRef.current.inResizing) {
                !resizingRef.current.startMouseOffsetX &&
                    (resizingRef.current.startMouseOffsetX =
                        e.clientX - resizingRef.current.startX);
                (indicatorRef.current as HTMLDivElement)?.setAttribute(
                    'style',
                    `transform:translateX(${
                        // 鼠标 x 轴坐标 - 鼠标相对指示器的偏移量 = 指示器的坐标
                        Math.max(
                            e.clientX - resizingRef.current.startMouseOffsetX,
                            resizingRef.current.boundary,
                        ) - resizingRef.current.offsetX
                    }px);display:block;`,
                );
            }
        },
        [id],
    );

    const resizingHandler = useCallback(() => {
        if (indicatorRef.current) {
            if (resizingRef.current.inResizing) {
                // 显示指示器并将指示器定位到 resizing dragger 的中线
                (indicatorRef.current as HTMLDivElement).setAttribute(
                    'style',
                    `transform:translateX(${
                        resizingRef.current.startX - resizingRef.current.offsetX
                    }px);display:block;`,
                );
            } else {
                // 隐藏指示器
                (indicatorRef.current as HTMLDivElement).setAttribute('style', 'display:none;');
                // 重置初始指示器和鼠标点击的偏移量
                resizingRef.current.startMouseOffsetX = 0;
            }
        }
    }, [id]);

    useEffect(() => {
        if (indicatorRef.current) {
            resizingRef.current.offsetX = indicatorRef.current.parentNode.getBoundingClientRect().x;
            const { ownerDocument } = indicatorRef.current as HTMLDivElement;
            resizingHandler();
            // 原生的方式替代 react state 驱动，用来解决性能问题
            eventBus.on(getResizingEvent(id), (resizingPayload: any) => {
                resizingRef.current = {
                    ...resizingRef.current,
                    ...resizingPayload,
                    // 在每次开始拖动前重新校正一遍 offsetX，因为可能随着视窗 resizing 后导致 offsetX 已经变化
                    offsetX: indicatorRef.current.parentNode.getBoundingClientRect().x,
                };
                resizingHandler();
            });
            ownerDocument.addEventListener('mousemove', onDrag);
        }
        return () => {
            eventBus.off(getResizingEvent(id));
            if (indicatorRef.current) {
                const { ownerDocument } = indicatorRef.current as HTMLDivElement;
                ownerDocument.removeEventListener('mousemove', onDrag);
            }
        };
    }, [id]);

    return (
        <div
            ref={(dom) => {
                dom && (indicatorRef.current = dom);
            }}
            className="spotter-table-column-resizable-marker"
        />
    );
};

export const useResizable = ({
    headerCell: OriginHeaderCell,
    key,
}: {
    headerCell: any;
    // setColumns: Dispatch<SetStateAction<SptTableColumn[]>>;
    key: string;
}) => {
    const resizingSettingRef = useRef<{
        // 是否处于 resizing 动作中
        inResizing: boolean;
        // resizing 的最小宽度
        boundary: number;
        // x 轴的初始位置
        startX: number;
    }>({ inResizing: false, boundary: 0, startX: 0 });

    const updateResizableColumns = useCallback((originColumns: SptTableColumn[]) => {
        const cols: any[] = originColumns.map((originCol) => ({
            ...originCol,
            onHeaderCell: (col: any) => ({
                ...originCol.onHeaderCell?.(col),
                width: col.width,
                OriginHeaderCell,
                onResizeStart: (thRect: DOMRect, thChildRect: DOMRect, triggerRect: DOMRect) => {
                    resizingSettingRef.current = {
                        inResizing: true,
                        // 必须用 thRect 的 x 坐标因为 thChild 可能是右对齐.
                        boundary: toFloat(
                            thRect.x +
                                Math.min(thChildRect.width, col.resizable?.boundary ?? 71) +
                                // 16 for <th> padding block 8px
                                17,
                        ),
                        startX: toFloat(triggerRect.x + triggerRect.width * 0.5),
                    };
                    eventBus.emit(getResizingEvent(key), resizingSettingRef.current);
                },
                onResizeStop: (diffWidthByIndicator: number, triggerX: number) => {
                    // 因为要提前清空来尽可能早的隐藏指示器，清空后还会临时用一次计算，所以在这里缓存一下
                    const { boundary } = resizingSettingRef.current;
                    // 重置列 resizing 配置
                    resizingSettingRef.current = {
                        inResizing: false,
                        boundary: 0,
                        startX: 0,
                    };
                    eventBus.emit(getResizingEvent(key), resizingSettingRef.current);
                    eventBus.emit(`resize_column_${key}`, {
                        columnKey: col.key,
                        width: Math.max((boundary ?? 0) - triggerX, diffWidthByIndicator),
                    });
                },
            }),
        }));

        return !cols.some((i) => i.key === 'resize-placeholder')
            ? [
                  ...cols,
                  // 自动注入空白列来吸收多余的宽度，否则 resizing 后的总列宽小于容器宽度时会因为 antd 会强制其他列按比例吸收被调低的列宽出现抖动问题
                  {
                      key: 'resize-placeholder',
                      search: false,
                      editable: false,
                      className: 'resize-placeholder',
                      render: () => <span />,
                  },
              ]
            : cols;
    }, []);

    return useMemo(
        () => ({
            ResizingHeaderCell,
            ResizingIndicator,
            updateResizableColumns,
        }),
        [],
    );
};
