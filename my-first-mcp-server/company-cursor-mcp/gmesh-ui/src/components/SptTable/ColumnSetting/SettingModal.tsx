import React, { useState, useCallback, useMemo, FC, useEffect } from 'react';
import { Input, Space, Menu, MenuProps, Typography, Form, Popconfirm, Empty } from 'antd';
import { ProFormText } from '@ant-design/pro-components';
import { useSptIntl } from '@/lang';
import GroupColumnList, { Group } from './GroupColumnList';
import SortableList from './SortableList';
import { SptTableColumn } from '..';
import { debounce } from '@/utils/common';
import { useSortableList, useSortableListDispatch } from './Store';
import { ColumnGroupConf } from './typing';
import SptModal from '@/components/Modal';
import SptButton from '@/components/Button';
import SptModalForm from '@/components/ModalForm';
import { useStyles } from '../style';
import classNames from 'classnames';

type GroupList = Group[];
export type ActionType = 'add' | 'edit' | 'selected';
export interface ModalBaseType {
    open: boolean;
    type?: ActionType;
    name?: string;
    cacheIndex?: number;
}

export interface Params {
    type: ModalBaseType['type'];
    cacheIndex: number;
    name: string;
    selectedColumns: SptTableColumn[];
}

interface SettingModalProps extends ModalBaseType {
    columns: SptTableColumn[];
    columnGroupConf: ColumnGroupConf;
    onClose: () => void;
    onSave: (params: Params) => void;
    onDelete: (cacheIndex: number) => void;
    onApply: (params: Params) => void;
    onReset: () => void;
}

type MenuItem = Required<MenuProps>['items'][number];

const { Text, Link } = Typography;
const menuAllKey = '__all__';
const menuOthersKey = '__others__';

const modalStyles = {
    mask: {},
    content: {
        padding: '16px 0',
    },
    header: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        padding: '0px 24px 12px 24px',
        marginBottom: 0,
    },
    body: {
        paddingLeft: 0,
        paddingRight: 2,
        marginRight: 0,
        overflow: 'auto',
    },

    footer: {
        borderTop: '1px solid rgba(0, 0, 0, 0.06)',
        paddingTop: 16,
        marginTop: 0,
    },
};
/**
 * 获取分组菜单项
 * @param groupListData
 * @returns
 */
const getMenuItems = (
    intl: ReturnType<typeof useSptIntl>,
    groupListData: GroupList,
): MenuItem[] => {
    return [
        {
            label: intl.getMessage('common.all', '全部'),
            key: menuAllKey,
        },
        ...groupListData.map((group) => ({
            label: group.name,
            key: group.key,
        })),
    ];
};
const SettingModal: FC<SettingModalProps> = ({
    open,
    type,
    name,
    cacheIndex,
    columns,
    columnGroupConf,
    onClose,
    onSave,
    onDelete,
    onApply,
    onReset,
}) => {
    const { styles } = useStyles();
    const intl = useSptIntl();
    const [searchForm] = Form.useForm();
    const dispatch = useSortableListDispatch();
    const sortableList = useSortableList();
    const selectedColumnKeys = sortableList.map((item) => item.dataIndex);
    const isAll = selectedColumnKeys.length === columns.length;
    // 分组处理
    const originGroupList = useMemo(() => {
        // 完全拷贝 columns 数组
        let originColumns = [...columns];
        const list: GroupList = [];
        const othersText = intl.getMessage('common.others', '其它') as string;
        for (let i = 0; i < columnGroupConf.length; i++) {
            const group = columnGroupConf[i];
            const groupDataIndexList = group.dataIndexList;
            const groupColumns = originColumns.filter((column) =>
                groupDataIndexList.includes(column.dataIndex),
            );
            // 更新原数组，删除已过滤的项
            originColumns = originColumns.filter(
                (column) => !groupDataIndexList.includes(column.dataIndex),
            );
            list.push({
                key: `__${group.name}__`,
                name: group.name,
                list: groupColumns,
            });
        }
        if (originColumns.length) {
            list.push({
                key: menuOthersKey,
                name: othersText,
                list: originColumns,
            });
        }
        return list;
    }, [columns]);
    const menuItems = useMemo(() => getMenuItems(intl, originGroupList), [columns]);
    const isGroup = columnGroupConf.length > 0;
    const [menuSelectedKeys, setMenuSelectedKeys] = useState<string[]>([menuAllKey]);
    const [groupList, setGroupList] = useState<GroupList>([]);

    useEffect(() => {
        open && setGroupList(originGroupList);
    }, [originGroupList, open]);

    /**
     * 重置
     */
    const reset = () => onReset();
    /**
     * 切换菜单
     */
    const handleMenuSelect = (selectedKey: string) => {
        setMenuSelectedKeys([selectedKey]);
        // 清空搜索
        searchForm.setFieldValue('searchKey', '');

        // 检查 originGroupList 是否为 null 或 undefined
        if (!originGroupList) {
            console.error('originGroupList is not initialized');
            return;
        }

        if (selectedKey === menuAllKey) {
            setGroupList(originGroupList);
        } else {
            // 检查 selectedKey 是否存在于 originGroupList 中
            const foundGroup = originGroupList.find((group) => group.key === selectedKey);
            if (foundGroup) {
                setGroupList([foundGroup]);
            } else {
                console.warn(`Selected key ${selectedKey} not found in originGroupList`);
                setGroupList([]);
            }
        }
    };

    /**
     * 搜索列
     */
    const handleSearch = useCallback(
        debounce((e: React.ChangeEvent<HTMLInputElement>) => {
            // 左侧分组菜单重置为全部
            setMenuSelectedKeys([menuAllKey]);
            if (e.target.value) {
                setGroupList(
                    originGroupList
                        .map((group) => ({
                            ...group,
                            list: group.list.filter(
                                (column) =>
                                    typeof column.title === 'string' &&
                                    column.title
                                        .toLowerCase()
                                        .includes(e.target.value.toLowerCase()),
                            ),
                        }))
                        .filter((group) => group.list.length > 0), // 仅保留有列的组
                );
            } else {
                setGroupList(originGroupList);
            }
        }, 400),
        [originGroupList],
    ); // 设置防抖延迟为 400 毫秒

    /**
     * 处理全选
     */
    const handleSelectAll = () => {
        dispatch && dispatch({ type: isAll ? 'batchHide' : 'batchAdd', data: columns });
    };

    /**
     * 取消处理
     */
    const handleClose = () => {
        searchForm.setFieldValue('searchKey', '');
        setMenuSelectedKeys([menuAllKey]);
        onClose();
    };

    /**
     * 存为预设确认弹窗
     * @returns
     */
    const ConfirmSave: FC = () => {
        const sortColumns = useSortableList();
        return (
            <SptModalForm<{
                name: string;
            }>
                title={intl.getMessage('columnSetting.saveColumnSetting', '存为预设')}
                width={572}
                modalProps={{
                    destroyOnClose: true,
                }}
                trigger={
                    <SptButton>
                        {intl.getMessage('columnSetting.saveColumnSetting', '存为预设')}
                    </SptButton>
                }
                onFinish={async (values) => {
                    onSave({
                        type,
                        cacheIndex: cacheIndex as number,
                        name: values.name,
                        selectedColumns: sortColumns,
                    });
                    return true;
                }}
            >
                <ProFormText
                    label={intl.getMessage('columnSetting.columnSettingName', '预设名称')}
                    name="name"
                    required
                    rules={[
                        {
                            required: true,
                            max: 20,
                        },
                    ]}
                />
            </SptModalForm>
        );
    };

    // 删除组件
    const DeleteButton: FC = () => {
        return (
            <Popconfirm
                title={intl.getMessage(
                    'columnSetting.deleteColumnSettingConfirm',
                    '确定删除该预设吗',
                )}
                styles={{
                    root: {
                        width: 254,
                    },
                }}
                onConfirm={() => onDelete(cacheIndex as number)}
            >
                <SptButton className="spt-table-column-setting-delete-button">
                    {intl.getMessage('common.delete', '删除')}
                </SptButton>
            </Popconfirm>
        );
    };

    const footerNode = (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SptButton type="link" onClick={reset}>
                {intl.getMessage('columnSetting.restoreDefault', '恢复默认')}
            </SptButton>
            <Space>
                <SptButton onClick={handleClose}>
                    {intl.getMessage('common.cancel', '取消')}
                </SptButton>
                {type === 'add' ? <ConfirmSave /> : <DeleteButton />}

                <SptButton
                    type="primary"
                    onClick={() => {
                        onApply({
                            type,
                            name: name as string,
                            cacheIndex: cacheIndex as number,
                            selectedColumns: sortableList,
                        });
                        handleClose();
                    }}
                >
                    {type === 'edit'
                        ? intl.getMessage('common.saveAndApply', '保存并应用')
                        : intl.getMessage('common.apply', '应用')}
                </SptButton>
            </Space>
        </div>
    );
    return (
        <SptModal
            className={classNames('spt-column-setting', styles.columnSettingModal)}
            title={
                type === 'edit'
                    ? intl.formatWithParams('columnSetting.editColumnSetting', { name })
                    : intl.getMessage('columnSetting.title', '列配置')
            }
            open={open}
            onCancel={handleClose}
            footer={footerNode}
            width={800}
            styles={modalStyles}
            destroyOnClose
            maskClosable={false}
        >
            <div style={{ display: 'flex' }} key="content">
                {isGroup ? (
                    <div
                        style={{
                            width: 160,
                            padding: '8px 12px',
                            borderRight: '1px solid rgba(0, 0, 0, 0.06)',
                            overflow: 'auto',
                            height: 'calc(100vh - 216px)',
                        }}
                    >
                        <Menu
                            style={{ border: 'none' }}
                            onClick={(e) => handleMenuSelect(e.key)}
                            selectedKeys={menuSelectedKeys}
                            items={menuItems}
                        />
                    </div>
                ) : null}

                <div
                    style={{
                        flex: 1,
                        paddingRight: 2,
                    }}
                >
                    <div
                        style={{
                            paddingLeft: 16,
                            paddingRight: 14,
                        }}
                    >
                        <Form form={searchForm}>
                            <Form.Item noStyle name="searchKey">
                                <Input
                                    allowClear
                                    placeholder={intl.getMessage(
                                        'columnSetting.searchInputPlaceholder',
                                        '搜索字段',
                                    )}
                                    onChange={handleSearch}
                                    style={{ marginTop: 12, marginBottom: 8 }}
                                />
                            </Form.Item>
                        </Form>

                        {/* 当搜索和选中分组时，隐藏统计 */}
                        {!searchForm.getFieldValue('searchKey') &&
                        menuSelectedKeys[0] === menuAllKey ? (
                            <div style={{ marginBottom: 8, lineHeight: '32px' }}>
                                <Text style={{ marginRight: 8 }}>
                                    {intl.formatWithParams('columnSetting.all', {
                                        allCount: selectedColumnKeys.length,
                                    })}
                                </Text>
                                <Link onClick={handleSelectAll}>
                                    {isAll
                                        ? intl.getMessage('common.cancelSelectAll', '取消全选')
                                        : intl.getMessage('common.selectAll', '全选')}
                                </Link>
                            </div>
                        ) : null}
                    </div>
                    {groupList.length ? (
                        <div
                            style={{
                                width: '100%',
                                overflow: 'auto',
                                height: 'calc(100vh - 308px)',
                                paddingLeft: 16,
                                paddingRight: 14,
                            }}
                        >
                            {groupList.map((group) => (
                                <GroupColumnList key={group.key} group={group} isGroup={isGroup} />
                            ))}
                        </div>
                    ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    )}
                </div>
                <div
                    style={{
                        width: 224,
                        borderLeft: '1px solid rgba(0, 0, 0, 0.06)',
                        padding: '12px 0 0 0',
                    }}
                >
                    <SortableList key="sortableList" />
                </div>
            </div>
        </SptModal>
    );
};

export default SettingModal;
