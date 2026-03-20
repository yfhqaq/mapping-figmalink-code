import React, { FC, useEffect, useRef, useState } from 'react';
import { Tooltip, Typography } from 'antd';
import { CloseOutlined, HolderOutlined } from '@ant-design/icons';
import { CSS } from '@dnd-kit/utilities';
import {
    DndContext,
    DragEndEvent,
    DragMoveEvent,
    MouseSensor,
    useDraggable,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import SptIcon from '@/components/SptIcon';
import { useSptIntl } from '@/lang';
import { useSortableList, useSortableListDispatch } from './Store';
import { SortableItemType, SortableListType } from './typing';

const { Text, Link } = Typography;

const Item: FC<{ item: SortableItemType; className?: string }> = ({ item }) => {
    const intl = useSptIntl();
    const [showHideIcon, setShowHideIcon] = useState(false);
    const dispatch = useSortableListDispatch();
    return (
        <div
            className="item"
            key={item.dataIndex as string}
            onMouseOver={() => setShowHideIcon(true)}
            onMouseLeave={() => setShowHideIcon(false)}
        >
            <div className="content-wrap">
                <span style={{ marginRight: 5 }} key={item.dataIndex as string}>
                    {!item.fixed ? (
                        <HolderOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} />
                    ) : (
                        <SptIcon type="sptfont-Pushpin_pined" size="14px" className="is-fixed" />
                    )}
                </span>
                {item.title as string}
            </div>
            {!item.disableColumnHide && !item.fixed && showHideIcon ? (
                <span
                    style={{
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        dispatch &&
                            dispatch({
                                type: 'hide',
                                data: item.dataIndex,
                            });
                    }}
                >
                    <Tooltip title={intl.getMessage('common.hide', '隐藏')}>
                        <CloseOutlined style={{ color: 'rgba(0, 0, 0, 0.5)' }} />
                    </Tooltip>
                </span>
            ) : null}
        </div>
    );
};
const ItemWrap: FC<{ item: any }> = ({ item }) => {
    return (
        <div className="sort-item-wrap">
            <Item item={item} />
        </div>
    );
};
const SortableItemWrap: FC<{ item: any }> = ({ item }) => {
    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
        id: item.dataIndex,
    });
    const { active } = useDraggable(item);

    // 禁用点 Y 的转换，避免高度被压缩
    if (transform?.scaleY) {
        transform.scaleY = 1;
    }

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className={`sort-item-wrap ${active?.id === item.dataIndex ? 'active' : ''}`}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
            }}
        >
            <div className="enable">
                <Item item={item} />
            </div>
        </div>
    );
};

const SortableList: FC = () => {
    const intl = useSptIntl();
    const dispatch = useSortableListDispatch();
    const selectedColumns = useSortableList();
    const currentCount = useRef(selectedColumns.length);
    const getMoveIndex = (array: SortableListType, dragItem: DragMoveEvent) => {
        const { active, over } = dragItem;
        const activeIndex = array.findIndex((item) => item.dataIndex === active.id);
        const overIndex = array.findIndex((item) => item.dataIndex === over?.id);

        // 处理未找到索引的情况
        return {
            activeIndex: activeIndex === -1 ? 0 : activeIndex,
            overIndex: overIndex === -1 ? activeIndex : overIndex,
        };
    };

    const dragEndEvent = (dragItem: DragEndEvent) => {
        const { active, over } = dragItem;
        if (!active || !over) return; // 处理边界情况

        const moveDataList = [...selectedColumns];
        const { activeIndex, overIndex } = getMoveIndex(moveDataList, dragItem);

        if (activeIndex !== overIndex) {
            const newDataList = arrayMove(moveDataList, activeIndex, overIndex);
            dispatch &&
                dispatch({
                    type: 'update',
                    data: newDataList,
                });
        }
    };

    /**
     * 拖拽传感器
     * 在移动像素1px范围内，不触发拖拽事件
     * 这样能避免无法触发被推拽元素内部的点击事件
     */
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 1,
            },
        }),
    );

    /**
     * 清空
     */
    const clear = () => {
        dispatch && dispatch({ type: 'clear' });
    };

    // 新增勾选排序时，自动滚动到底
    useEffect(() => {
        // 判断新增
        if (selectedColumns.length > currentCount.current) {
            document.getElementById('scrollWarp')?.lastElementChild?.scrollIntoView({
                block: 'end',
                behavior: 'smooth',
            });
        }
        currentCount.current = selectedColumns.length;
    }, [selectedColumns]);

    return (
        <>
            <div style={{ padding: '0 16px', marginBottom: 8, lineHeight: '32px' }}>
                <Text style={{ marginRight: 8 }}>
                    {intl.formatWithParams('columnSetting.selected', {
                        selectedCount: selectedColumns.length,
                    })}
                </Text>
                <Link onClick={clear}>{intl.getMessage('common.clear', '清空')}</Link>
            </div>
            <div style={{ overflow: 'auto', height: 'calc(100vh - 268px)' }}>
                {selectedColumns
                    .filter(
                        (item) =>
                            (typeof item.fixed === 'boolean' && item.fixed === true) ||
                            item.fixed === 'left',
                    )
                    .map((item) => (
                        <ItemWrap key={item.dataIndex} item={item} />
                    ))}
                <DndContext
                    modifiers={[restrictToVerticalAxis, restrictToParentElement]}
                    onDragEnd={dragEndEvent}
                    sensors={sensors}
                >
                    <SortableContext
                        items={selectedColumns?.map((i) => i?.dataIndex as string)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div id="scrollWarp">
                            {selectedColumns
                                .filter((item) => !item.fixed)
                                .map((item: any) => (
                                    <SortableItemWrap key={item.dataIndex} item={item} />
                                ))}
                        </div>
                    </SortableContext>
                </DndContext>
                {selectedColumns
                    .filter((item) => item.fixed === 'right')
                    .map((item) => (
                        <ItemWrap key={item.dataIndex} item={item} />
                    ))}
            </div>
        </>
    );
};

export default SortableList;
