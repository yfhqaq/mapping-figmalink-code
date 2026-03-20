import React, { FC } from 'react';
import { Typography } from 'antd';
import { useSptIntl } from '@/lang';
import ColumnList from './ColumnList';
import { useSortableList, useSortableListDispatch } from './Store';
import { SortableListType } from './typing';

export interface Group {
    key: string;
    name: string;
    list: SortableListType;
}

interface GroupColumnListProps {
    group: Group;
    isGroup: boolean;
}

const { Text, Link } = Typography;
const GroupColumnList: FC<GroupColumnListProps> = ({ group, isGroup }) => {
    const intl = useSptIntl();
    const { list, name } = group;
    const dispatch = useSortableListDispatch();
    const defaultValue = list
        .filter((item) => item.checked && item.disableChecked)
        .map((item) => item.dataIndex);

    const selectedColumnKeys = useSortableList().map((item) => item.dataIndex);
    const selectedValue = list
        .filter((item) => selectedColumnKeys.includes(item.dataIndex))
        .map((item) => item.dataIndex);

    const isAll = selectedValue.length === list.length;
    const disableCheckAll = defaultValue.length === list.length;

    const handleSelectAll = () => {
        dispatch && dispatch({ type: isAll ? 'batchHide' : 'batchAdd', data: list });
    };

    return (
        <div className="group-column-list-wrap">
            {isGroup ? (
                <>
                    <div style={{ marginBottom: 8 }}>
                        <Text style={{ fontWeight: 600, marginRight: 8, maxWidth: 250 }} ellipsis>
                            {name}
                        </Text>
                        <Link disabled={disableCheckAll} onClick={handleSelectAll}>
                            {isAll
                                ? intl.getMessage('common.cancelSelectAll', '取消全选')
                                : intl.getMessage('common.selectAll', '全选')}
                        </Link>
                    </div>
                    <ColumnList
                        columns={list}
                        defaultValue={defaultValue}
                        value={selectedValue}
                        isGroup
                    />
                </>
            ) : (
                <ColumnList columns={list} defaultValue={defaultValue} value={selectedValue} />
            )}
        </div>
    );
};

export default GroupColumnList;
