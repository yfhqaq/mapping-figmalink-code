import React, { FC, useCallback, useEffect, useRef } from 'react';
import { eventBus } from '@spotter/app-client-toolkit';
import { createPortal } from 'react-dom';
import { clearSelection, toFloat } from './utils';

enum SCROLLBAR_EVENT {
    FULL_WIDTH_UPDATE,
    TABLE_DODY_SCROLL,
    SCROLLBAR_MOVE,
}
const getScrollbarEvent = (id: string, event: SCROLLBAR_EVENT) => `${id}_SCROLL_BAR_${event}`;

export const StickyScrollbar: FC<{ id: string; getContainer: () => HTMLElement }> = ({
    id,
    getContainer,
}) => {
    const tableSizeRef = useRef<{
        fullWidth: number;
        scrollbarWidth: number;
        scrollbarScale: number;
        scrollbarThumbOffset: number;
        scrollbarClientX: number;
    }>({
        fullWidth: 0,
        scrollbarWidth: 0,
        scrollbarScale: 0,
        scrollbarThumbOffset: 0,
        scrollbarClientX: 0,
    });
    const scrollbarThumbRef = useRef<any>();
    const scrollbarRef = useRef<any>();
    const moveScrollbar = useCallback(
        (tableBodyScrollLeft: any) => {
            tableSizeRef.current.scrollbarThumbOffset =
                tableBodyScrollLeft * tableSizeRef.current.scrollbarScale;
            if (scrollbarThumbRef.current) {
                (scrollbarThumbRef.current as HTMLDivElement).style.setProperty(
                    'transform',
                    `translateX(${toFloat(tableSizeRef.current.scrollbarThumbOffset)}px)`,
                );
            }
        },
        [id],
    );

    useEffect(() => {
        // 当视窗尺寸更新时触发重新计算 scrollbar 宽度
        eventBus.on(
            getScrollbarEvent(id, SCROLLBAR_EVENT.FULL_WIDTH_UPDATE),
            ({ tableFullWidth, tableBodyScrollLeft }: any) => {
                const { width, x } = scrollbarRef.current.getBoundingClientRect();

                const scrollbarScale = Math.max(Math.min(width / tableFullWidth, 1), 0);
                tableSizeRef.current = {
                    ...tableSizeRef.current,
                    scrollbarWidth: width,
                    scrollbarClientX: x,
                    fullWidth: tableFullWidth,
                    scrollbarThumbOffset: tableBodyScrollLeft * scrollbarScale,
                    scrollbarScale,
                };
                // 如果比例等于 1 说明无法滚动
                if (tableSizeRef.current.scrollbarScale === 1) {
                    scrollbarThumbRef.current.style.setProperty('visibility', 'hidden');
                } else {
                    (scrollbarThumbRef.current as HTMLDivElement).setAttribute(
                        'style',
                        `visibility:visible;width:${toFloat(
                            tableSizeRef.current.scrollbarWidth *
                                tableSizeRef.current.scrollbarScale,
                        )}px;transform:translateX(${toFloat(
                            tableSizeRef.current.scrollbarThumbOffset,
                        )}px)`,
                    );
                }
            },
        );
        eventBus.on(getScrollbarEvent(id, SCROLLBAR_EVENT.TABLE_DODY_SCROLL), moveScrollbar);
        return () => {
            eventBus.off(getScrollbarEvent(id, SCROLLBAR_EVENT.FULL_WIDTH_UPDATE));
            eventBus.off(getScrollbarEvent(id, SCROLLBAR_EVENT.TABLE_DODY_SCROLL));
        };
    }, [id]);
    return createPortal(
        <div
            ref={(dom) => {
                if (dom) {
                    scrollbarRef.current = dom;
                    if (scrollbarRef.current) {
                        const { width, x } = scrollbarRef.current.getBoundingClientRect();
                        tableSizeRef.current = {
                            ...tableSizeRef.current,
                            scrollbarWidth: width,
                            scrollbarClientX: x,
                            scrollbarScale: Math.max(
                                Math.min(width / tableSizeRef.current.fullWidth ?? width, 1),
                                0,
                            ),
                        };
                    }
                }
            }}
            className="spotter-table-sticky-scroll-bar"
        >
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
                onMouseDown={(mouseDownEvent) => {
                    // 清空选项
                    mouseDownEvent.stopPropagation();
                    clearSelection();
                    const { ownerDocument } = scrollbarThumbRef.current as HTMLDivElement;
                    // 鼠标单击时与滚动条的 x 轴相对偏移量，用来保持拖动过程中维持相对位置
                    const mouseOffsetXWithScrollBarThumb =
                        mouseDownEvent.clientX -
                        tableSizeRef.current.scrollbarClientX -
                        tableSizeRef.current.scrollbarThumbOffset;
                    (scrollbarRef.current as HTMLDivElement).classList.add(
                        'spotter-table-sticky-scroll-bar-thumb-dragging',
                    );
                    const scrollbarDrag = (mouseMoveEvent: MouseEvent) => {
                        // 通过该类名来实现 table 不可选中的效果，避免拖动时候选中文本
                        tableSizeRef.current.scrollbarThumbOffset = Math.min(
                            Math.max(
                                mouseMoveEvent.clientX -
                                    mouseOffsetXWithScrollBarThumb -
                                    tableSizeRef.current.scrollbarClientX,
                                0,
                            ),
                            tableSizeRef.current.scrollbarWidth *
                                (1 - tableSizeRef.current.scrollbarScale),
                        );
                        eventBus.emit(
                            getScrollbarEvent(id, SCROLLBAR_EVENT.SCROLLBAR_MOVE),
                            // 将滚动条的 scrollLeft 通过比例转为实际 table body 的 scrollLeft
                            tableSizeRef.current.scrollbarThumbOffset /
                                tableSizeRef.current.scrollbarScale,
                        );
                    };
                    ownerDocument.addEventListener('mousemove', scrollbarDrag);
                    ownerDocument.addEventListener(
                        'mouseup',
                        (mouseUpEvent: MouseEvent) => {
                            mouseUpEvent.stopPropagation();
                            ownerDocument.removeEventListener('mousemove', scrollbarDrag);
                            (scrollbarRef.current as HTMLDivElement).classList.remove(
                                'spotter-table-sticky-scroll-bar-thumb-dragging',
                            );
                        },
                        { once: true },
                    );
                }}
                className="spotter-table-sticky-scroll-bar-thumb"
                ref={(dom) => {
                    dom && (scrollbarThumbRef.current = dom);
                }}
            />
            <div
                className="spotter-table-sticky-scroll-bar-track"
                onClick={(e) => {
                    eventBus.emit(
                        getScrollbarEvent(id, SCROLLBAR_EVENT.SCROLLBAR_MOVE),
                        toFloat(e.clientX - tableSizeRef.current.scrollbarClientX),
                    );
                }}
            />
        </div>,
        getContainer(),
    );
};

export const ScrollBodyWrapper: FC<{ id: any } & Record<string, any>> = ({ id, ...restProps }) => {
    const tbodyRef = useRef<any>();
    const scrollContainerRef = useRef<any>();
    const scrollHandler = useCallback(
        (e: any) => {
            eventBus.emit(
                getScrollbarEvent(id, SCROLLBAR_EVENT.TABLE_DODY_SCROLL),
                e.target.scrollLeft,
            );
        },
        [id],
    );
    const scrollbarDragHandler = useCallback(
        (scrollLeft: any) => {
            scrollContainerRef.current.scrollLeft = scrollLeft;
        },
        [id],
    );
    const resizeHandler = useCallback(() => {
        setTimeout(() => {
            eventBus.emit(getScrollbarEvent(id, SCROLLBAR_EVENT.FULL_WIDTH_UPDATE), {
                tableFullWidth: (
                    tbodyRef.current as HTMLTableSectionElement
                ).getBoundingClientRect().width,
                tableBodyScrollLeft: (tbodyRef.current as HTMLTableSectionElement).parentElement!
                    .parentElement!.scrollLeft,
            });
        }, 0);
    }, [id]);
    useEffect(() => {
        if (tbodyRef.current) {
            (tbodyRef.current as HTMLTableSectionElement).addEventListener('scroll', scrollHandler);
            // 当视窗尺寸更新时触发重新计算容器宽度
            window.addEventListener('resize', resizeHandler);
        }

        return () => {
            if (tbodyRef.current) {
                window.removeEventListener('resize', resizeHandler);
                eventBus.off(
                    getScrollbarEvent(id, SCROLLBAR_EVENT.SCROLLBAR_MOVE),
                    scrollbarDragHandler,
                );
            }
        };
    }, [id]);
    return (
        <tbody
            ref={(dom) => {
                if (dom) {
                    tbodyRef.current = dom;
                    // 向上找两级找到 div.ant-table-body，作为可滚动的元素容器
                    scrollContainerRef.current = dom.parentElement!.parentElement!;
                    resizeHandler();
                    // 每次检测到更新 dom 都重新进行 scroll 事件订阅
                    scrollContainerRef.current.removeEventListener('scroll', scrollHandler);
                    scrollContainerRef.current.addEventListener('scroll', scrollHandler);
                    // 每次检测到更新 dom 都重新进行 scroll-bar 事件订阅
                    eventBus.off(
                        getScrollbarEvent(id, SCROLLBAR_EVENT.SCROLLBAR_MOVE),
                        scrollbarDragHandler,
                    );
                    eventBus.on(
                        getScrollbarEvent(id, SCROLLBAR_EVENT.SCROLLBAR_MOVE),
                        scrollbarDragHandler,
                    );
                }
            }}
            {...restProps}
        />
    );
};

/**
 * 这里必须要自己实现一个 scrollbar 因为 antd 原生自带的 scrollbar 存在一个 bug，在滚动到底部时他手动点击一次就会消除掉 scrollbar, 不然可以通过 css 来 hack
 * @param id
 */
