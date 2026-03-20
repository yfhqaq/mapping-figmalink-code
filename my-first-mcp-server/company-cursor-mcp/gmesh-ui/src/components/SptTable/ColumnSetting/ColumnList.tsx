import React, { FC } from 'react';
import { Checkbox, Col, Row, Tooltip } from 'antd';
import SptTooltipIcon from '@/components/SptTooltipIcon';
import { runFunction } from '@/utils/runFunction';
import { useSortableListDispatch } from './Store';
import { SortableItemType, SortableListType } from './typing';

interface ColumnListProps {
    columns: SortableListType;
    defaultValue: SortableItemType['dataIndex'][];
    value: SortableItemType['dataIndex'][];
    isGroup?: boolean; // 是否为分组列
}

const ColumnList: FC<ColumnListProps> = ({ columns, defaultValue, value, isGroup = false }) => {
    const dispatch = useSortableListDispatch();
    return (
        <Checkbox.Group style={{ width: '100%' }} defaultValue={defaultValue} value={value}>
            <Row gutter={[0, 12]}>
                {columns.map((column) => {
                    const title = runFunction(column.title, column);
                    return (
                        <Col span={isGroup ? 12 : 8} key={column.dataIndex}>
                            <Checkbox
                                value={column.dataIndex}
                                disabled={column.disableChecked}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        return (
                                            dispatch &&
                                            dispatch({
                                                type: 'add',
                                                data: column,
                                            })
                                        );
                                    }
                                    dispatch &&
                                        dispatch({
                                            type: 'hide',
                                            data: column.dataIndex,
                                        });
                                }}
                            >
                                {column.tooltip ? (
                                    <>
                                        <span style={{ marginRight: 4 }}>{title}</span>
                                        {typeof column.tooltip === 'string' ? (
                                            <Tooltip title={column.tooltip as string}>
                                                <span>
                                                    <SptTooltipIcon />
                                                </span>
                                            </Tooltip>
                                        ) : null}
                                    </>
                                ) : (
                                    title
                                )}
                            </Checkbox>
                        </Col>
                    );
                })}
            </Row>
        </Checkbox.Group>
    );
};

export default ColumnList;
