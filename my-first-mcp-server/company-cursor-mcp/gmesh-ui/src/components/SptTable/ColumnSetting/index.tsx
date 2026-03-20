import React, { FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Dropdown, MenuProps, message, Tooltip, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useLocalCache } from '@spotter/app-client-toolkit';
import { isNonEmptyObject } from '@/utils/common';
import { useSptIntl } from '@/lang';
import SptIcon from '@/components/SptIcon';
import { SptComponentContext } from '@/components/Provider';
import SettingModal, { ActionType, ModalBaseType, Params } from './SettingModal';
import { SpotterTableColumnSetting, SptTableColumn } from '..';
import { SortableListProvider } from './Store';
import { ColumnGroupConf, ColumnSettingCache, ColumnSettingList, SortableListType } from './typing';
import { generatorColumnList, generatorSortList } from './utils';
import { ColumnSettingCacheField } from './const';
import './style.less';

const { Text } = Typography;
interface ColumnSettingProps {
    cacheKey: string;
    initColumnSettingList?: ColumnSettingList;
    columns: SptTableColumn[];
    columnGroupConf?: ColumnGroupConf;
    onApply: (columns: SptTableColumn[]) => void;
}

/**
 * 菜单项
 * @param index
 * @param name
 * @returns
 */
const MenuItem: FC<{
    index: number;
    name: string;
    onSelected: (type: ActionType, index: number, name: string) => void;
    isAdd?: boolean;
}> = ({ index, name, onSelected, isAdd = false }) => {
    const intl = useSptIntl();
    const ElRef = useRef(null);
    const [showEdit, setShowEdit] = useState(false);
    const itemName = isAdd ? intl.getMessage('columnSetting.addColumnSetting', '自定义列') : name;
    return (
        <div
            ref={ElRef}
            onMouseOver={() => setShowEdit(true)}
            onMouseLeave={() => setShowEdit(false)}
            className="dropdown-menu-item-wrap"
        >
            <Text
                className="item-name"
                ellipsis={{
                    tooltip: {
                        title: itemName,
                        placement: 'left',
                    },
                }}
                onClick={() => onSelected(isAdd ? 'add' : 'selected', index, name)}
            >
                {itemName}
            </Text>
            {!isAdd && showEdit ? (
                <div className="edit-icon" onClick={() => onSelected('edit', index, name)}>
                    <EditOutlined style={{ color: 'rgba(0, 0, 0, 0.5)' }} />
                </div>
            ) : null}
        </div>
    );
};

const ColumnSetting: FC<ColumnSettingProps> = ({
    cacheKey,
    initColumnSettingList = [],
    columns,
    columnGroupConf = [],
    onApply,
}) => {
    const intl = useSptIntl();
    const defaultColumnSettingList = useMemo(
        () => generatorSortList(columns, initColumnSettingList),
        [columns, initColumnSettingList],
    );
    const columnList = useMemo(
        () => generatorColumnList(columns, initColumnSettingList),
        [columns, initColumnSettingList],
    );
    const { routes } = useContext(SptComponentContext);
    const location = useLocation();
    const {
        getCache,
        setCache,
        cacheKey: CACHE_KEY,
    } = useLocalCache<SpotterTableColumnSetting>(cacheKey, {}, routes ?? [], location);
    const DefaultMenuData: MenuProps['items'] = [
        {
            key: '',
            label: (
                <MenuItem
                    isAdd
                    index={0}
                    name=""
                    onSelected={(index, type, name) => handleClick(index, type, name)}
                />
            ),
        },
    ];
    const [modalData, setModalData] = useState<ModalBaseType>({
        open: false,
        type: 'add',
        name: '',
        cacheIndex: 0,
    });
    const [menuData, setMenuData] = useState<MenuProps['items']>(DefaultMenuData);
    const [menuSelectedKeys, setMenuSelectedKeys] = useState<string[]>([]);
    const [selectedColumns, setSelectedColumns] = useState<SortableListType>([]);

    /**
     * 处理设置缓存
     * @param newCacheData
     */
    const handleSetCache = (
        newCacheData: SpotterTableColumnSetting,
        updateRemoteCache: boolean = false,
    ) => {
        setCache(newCacheData);
        // 调用接口缓存
        if (updateRemoteCache) {
            try {
                window?.__SPOTTER_FE_CONFIG_API__?.tableConfig.singleSet(CACHE_KEY, newCacheData);
            } catch (error) {
                console.log(error);
            }
        }
    };

    /**
     * 获取列配置缓存数据
     */
    const getColumnSettingCacheData: () => {
        cacheData: any;
        columnSettingCacheData: ColumnSettingCache;
    } = () => {
        let cacheData = getCache();
        cacheData = isNonEmptyObject(cacheData) ? cacheData : {};
        return {
            cacheData,
            columnSettingCacheData: cacheData[ColumnSettingCacheField] ?? {},
        };
    };

    /**
     * 重置默认
     */
    const reset = () => {
        // 这里使用结构，使每次 set 时都触发组件刷新
        setSelectedColumns([...defaultColumnSettingList]);
    };

    /**
     * 应用处理
     * @param newColumns
     */
    const handleApply = (params: Params) => {
        const { cacheData, columnSettingCacheData } = getColumnSettingCacheData();
        if (params.selectedColumns.length === 0) {
            return message.error(intl.getMessage('columnSetting.mustShowOne', '至少展示一个字段'));
        }
        const newColumnKeys =
            params.type === 'selected'
                ? params.selectedColumns
                : params.selectedColumns.map((column) => column.dataIndex);
        onApply(newColumnKeys);
        // 更新默认预设
        columnSettingCacheData.defaultSortKeys = newColumnKeys;
        columnSettingCacheData.currentSettingIndex = params.type === 'add' ? -1 : params.cacheIndex;
        handleSetCache({ ...cacheData });
        setModalData({ open: false });
        setMenuSelectedKeys([`${params.cacheIndex}`]);
        if (params.type === 'edit') {
            handleSave(params);
        }
    };

    /**
     * 设置为缓存中排序数据
     * @param columnSettingIndex
     */
    const generatorCacheSortList = (columnSettingIndex: number) => {
        const { columnSettingCacheData } = getColumnSettingCacheData();
        const columnSettingSortList = columnSettingCacheData?.settings?.length
            ? columnSettingCacheData?.settings[columnSettingIndex].sortKeys
            : [];
        setSelectedColumns([...generatorSortList(columns, columnSettingSortList)]);
    };

    /**
     * 下拉菜单点击处理
     * @param type
     * @param index
     * @returns
     */
    const handleClick = (type: ActionType, index?: number, name?: string) => {
        if (type === 'add') {
            const { columnSettingCacheData } = getColumnSettingCacheData();
            // 始终展示当前列配置数据，即默认预设
            const columnSettingSortList = columnSettingCacheData.defaultSortKeys;
            setSelectedColumns([...generatorSortList(columns, columnSettingSortList ?? [])]);
            setModalData({
                open: true,
                type: 'add',
            });
        } else if (type === 'edit') {
            generatorCacheSortList(index as number);
            setModalData({
                open: true,
                type: 'edit',
                name,
                cacheIndex: index,
            });
        } else if (type === 'selected') {
            const { columnSettingCacheData } = getColumnSettingCacheData();
            const columnSettingSortList = columnSettingCacheData.settings.length
                ? columnSettingCacheData.settings[index as number].sortKeys
                : [];
            handleApply({
                type: 'selected',
                name: name as string,
                cacheIndex: index as number,
                selectedColumns: columnSettingSortList,
            });
            setMenuSelectedKeys([`${index}`]);
        }
    };

    /**
     * 生成菜单数据
     */
    const generatorMenuData = () => {
        const cacheData = getCache();
        // 打开弹窗时获取，否则初始化时拿不到
        if (isNonEmptyObject(cacheData)) {
            const columnSettingCacheData: ColumnSettingCache = cacheData[ColumnSettingCacheField];
            // 兼容旧版数据结构
            if (!columnSettingCacheData?.defaultSortKeys) {
                return setMenuData([]);
            }
            const { currentSettingIndex, settings } = columnSettingCacheData;
            // 若为默认预设，即 -1，没有选中菜单，
            setMenuSelectedKeys(currentSettingIndex > -1 ? [`${currentSettingIndex}`] : []);
            if (settings?.length > 0) {
                const _menuData: MenuProps['items'] = [];
                settings.map((item: any, index: number) => {
                    _menuData.push({
                        key: index,
                        label: <MenuItem index={index} name={item.name} onSelected={handleClick} />,
                    });
                });
                return setMenuData(_menuData.concat(DefaultMenuData));
            }
        }
        return setMenuData([]);
    };

    useEffect(() => {
        setSelectedColumns(defaultColumnSettingList);
        generatorMenuData();
    }, [defaultColumnSettingList]);

    /**
     * 保存
     * @param currentIndex
     * @param name
     * @param sortColumns
     */
    const handleSave: (params: Params) => void = ({
        type,
        cacheIndex: currentIndex,
        name,
        selectedColumns: sortColumns,
    }) => {
        if (sortColumns.length === 0) {
            return message.error(intl.getMessage('columnSetting.mustShowOne', '至少展示一个字段'));
        }
        const { cacheData, columnSettingCacheData } = getColumnSettingCacheData();
        // const sortKeys = sortColumns.map((column) => column.dataIndex).filter((item) => !!item);
        const sortKeys = sortColumns.map((column) => column.dataIndex);
        if (sortKeys.length)
            if (columnSettingCacheData?.settings?.length) {
                if (type === 'edit') {
                    columnSettingCacheData?.settings?.splice(currentIndex, 1, {
                        name,
                        sortKeys,
                    });
                } else {
                    columnSettingCacheData?.settings?.push({ name, sortKeys });
                }
            } else {
                columnSettingCacheData?.settings?.push({ name, sortKeys });
            }
        cacheData[ColumnSettingCacheField] = columnSettingCacheData;
        handleSetCache(cacheData, true);
        generatorMenuData();
        message.success(intl.getMessage('common.saveSuccess', '保存成功'));
    };

    /**
     * 删除
     * @param currentIndex
     */
    const handleDelete = (currentIndex: number) => {
        const { cacheData, columnSettingCacheData } = getColumnSettingCacheData();
        columnSettingCacheData?.settings.splice(currentIndex, 1);

        // 判断是否删除当前预设，若是，则需要把默认索引设置为默认的 index，即：-1
        if (currentIndex === columnSettingCacheData?.currentSettingIndex) {
            // 更新为默认预设 index
            columnSettingCacheData.currentSettingIndex = -1;
        }
        // 判断是否删除的项是当前已选项的前序，若是，则需要当前已选的值为 当前项索引 - 1，即：（currentSettingIndex - 1）
        else if (currentIndex < columnSettingCacheData?.currentSettingIndex) {
            // 更新为默认预设 index
            columnSettingCacheData.currentSettingIndex -= 1;
        }
        handleSetCache({ ...cacheData }, true);
        setModalData({
            open: false,
        });
        generatorMenuData();
        message.success(intl.getMessage('common.deleteSuccess', '删除成功'));
    };

    return (
        <SortableListProvider initialSortableList={selectedColumns}>
            <div className="spt-column-setting">
                <div className="dropdown-menu">
                    <Tooltip
                        title={intl.getMessage('columnSetting.title', '列配置')}
                        placement="topRight"
                        arrow={{ pointAtCenter: true }}
                    >
                        {menuData && menuData?.length > 0 ? (
                            <Dropdown
                                menu={{
                                    items: menuData,
                                    selectedKeys: menuSelectedKeys,
                                }}
                                trigger={['hover']}
                                overlayClassName="spt-column-setting"
                            >
                                <Button type="text" style={{ padding: 7 }}>
                                    <SptIcon
                                        type="sptfont-setting"
                                        size={'18px'}
                                        className="dropdown-icon"
                                    />
                                </Button>
                            </Dropdown>
                        ) : (
                            <Button
                                type="text"
                                style={{ padding: 7 }}
                                onClick={() => handleClick('add', +menuSelectedKeys[0])}
                            >
                                <SptIcon
                                    type="sptfont-setting"
                                    size={'18px'}
                                    className="dropdown-icon"
                                />
                            </Button>
                        )}
                    </Tooltip>
                </div>
                <SettingModal
                    {...modalData}
                    columns={columnList}
                    columnGroupConf={columnGroupConf}
                    onClose={() => {
                        setModalData({ open: false });
                    }}
                    onSave={handleSave}
                    onDelete={handleDelete}
                    onApply={handleApply}
                    onReset={reset}
                />
            </div>
        </SortableListProvider>
    );
};

export default ColumnSetting;
