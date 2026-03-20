import {
    ActionType,
    ProColumns,
    ProFormInstance,
    ProTableProps,
    omitUndefined,
    useDebounceFn,
    useMountMergeState,
    useRefFunction,
} from '@ant-design/pro-components';
import React, {
    FC,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState,
} from 'react';
import classnames from 'classnames';
import dayjs from 'dayjs';
import { useActivate } from 'react-activation';
import { useResizable } from './Resizable';
import { useFit } from './useFit';
import { nanoid } from 'nanoid';
import { SptComponentContext, SptComponentProvider } from '../Provider';
import { eventBus, getAppBootData, useLocalCache } from '@spotter/app-client-toolkit';
import { useLocation, useSearchParams } from 'react-router-dom';
import './style/index.less';
import Filter, { SptFormProps } from './Form';
import classNames from 'classnames';
import { ValueTypes } from './ValueType';
import Table from './Table';
import { Spin } from 'antd';
import omit from 'omit.js';
import Pagination from './Pagination';
import transformKey from './Form/transformKey';
import { SptPageContainerContext } from '../SptPageContainer';
import stringify from '@/utils/stringify';

import { parseDefaultColumnConfig } from './utils';
import { unstable_batchedUpdates } from 'react-dom';
import ColumnSetting from './ColumnSetting';
import { ColumnGroupConf, ColumnSettingCache, ColumnSettingList } from './ColumnSetting/typing';
import { ColumnSettingCacheField } from './ColumnSetting/const';
import {
    diffSortKeys,
    generatorSortList,
    mergeAddSortKeys,
    useFilterSptTableColumns,
} from './ColumnSetting/utils';

export type SptTableColumn<T = any, ValueType = 'text'> = ProColumns<T, ValueType> & {
    /**
     * 默认为 在 Table 中配置的 drawerTrigger 的值，优先级高于 Table 中的 drawerTrigger
     * 配置为 false 时该列所有的单元格在点击时不会触发 onRowDrawerChange
     */
    drawerTrigger?: boolean;
    // 可调整列相关参数
    resizable?: {
        /**
         * 最小宽度，指定某一列最低宽度，默认为 undefined，表示用全局的最小列限制
         */

        minWidth?: number;
        /**
         * @TODO 暂时没实现
         * 最大宽度，指定某一列的最大宽度，默认为 undefined，表示没有限制
         */
        maxWidth?: number;
    };
    /**
     * 列配置参数，禁用列隐藏
     */
    disableColumnHide?: boolean;
};

export type SptProColumns<T, U = 'text'> = SptTableColumn<T, U | ValueTypes>;

// TODO: 兼容searchConfig，移除不需要的search配置
export interface SptTableProps<T = any, U = any, ValueType = 'text'>
    extends Omit<
        ProTableProps<T, U, ValueType>,
        'scroll' | 'columns' | 'table' | 'toolBarRender' | 'form'
    > {
    /**
     * 等于之前的 scroll.x 默认为0
     * @description 需要自定义width的情况: 有column.width不为number || 有column.className覆盖了width
     */
    width?: string | number | true;
    /**
     * 适配模式
     * - auto: 自动适配，基于视窗高度 1080px 来启用不同的适配规则。
     * - content: 适配内容，即内容的高度优先，不设限制，表现为在溢出视窗高度的内容部分使用 sticky 模式下在 PageContainer 中滚动。
     * - container: 适配容器，即 table 容器的高度固定，内容溢出 table 容器的部分在 table body 内部滚动。
     * - none: 使用原始的 table 模式，不进行任何适配。
     */
    fit?: 'auto' | 'content' | 'container' | 'none';
    /**
     * @param open
     * @param record
     * @description 除了下述情况，点击行时会执行该回调函数
     * 1. 选中了某段文字
     * 2. 点击的元素是 a 标签
     */
    onRowDrawerChange?: (open: boolean, record: T) => void;
    /**
     * 重置时清除 url 的 table_search_params
     */
    resetTableSearchParams?: boolean;
    /**
     * 当选中了某段文字时触发
     */
    onRowSelection?: (
        selection: ReturnType<typeof document.getSelection>,
        event: React.MouseEvent<any, MouseEvent>,
    ) => void;
    columns: SptTableColumn<T, ValueType>[];
    /**
     * 配置整个 table 是否作为抽屉的触发器，优先级低于列中的设置，默认为 true
     * 配置为 false 时，如果不在某个 column 内单独配置 drawerTrigger 为 true，则永远不会触发 onRowDrawerChange
     */
    drawerTrigger?: boolean;
    /**
     * 可调整列宽配置
     */
    columnResizable?: {
        /**
         * 全局的默认最小列宽
         * 默认是 88px，最终的最小宽度的计算公式为 Math.min(minWidth, hugWidth)，hugWidth 是 td 的第一个子元素的宽度
         */
        minWidth?: number;
        /**
         * column 更新后优先使用缓存列宽
         * 默认是 false
         */
        preferResizeWidth?: boolean;
    };
    /**
     * spotter table 缓存的唯一的标识，会使用当前路由作为前缀，'spotter-table' 作为后缀
     */
    cacheKey?: string;
    /**
     * 是否继承PageContainer的Action区域, 默认为 false, 为true时会继承PageContainer的TableAction区域
     */
    inheritAction?: boolean;
    toolBarRender?: Exclude<ProTableProps<T, ValueType>['toolBarRender'], false>;
    form?: SptFormProps;
    /**
     * 启用列配置，默认 false
     */
    enableColumnSetting?: boolean;
    /**
     * 列分组配置
     */
    columnGroupConf?: ColumnGroupConf;
    /**
     * 初始化列配置列表，默认为空，为空时将使用默认列配置
     */
    initColumnSettingList?: ColumnSettingList;
    /**
     * 列配置是否显示新增列，默认为 true
     * 所有预设都会把新增的列勾选上，且在末尾展示
     * 在没有已选中的预设时，则会按原始列顺序显示新增的列
     */
    showNewColumn?: boolean;
}

export type SpotterTableColumnSetting = Record<string, { width: number; originWidth?: number }> & {
    /**
     * 表格列排序展示配置
     *
     * 这里为什么要单拎一个字段来缓存，而不是整合到列宽配置中去？
     * 原因如下：
     * 1. 列宽在整个表格中，只有一套配置，而排序展示有多套，且不是所有列都能排序或者展示
     * 2. 列排序展示作为表格全局配置，独立出来既不影响已有的列宽处理，又方便独立处理，避免整合带来兼容性问题。
     */
    [ColumnSettingCacheField]?: ColumnSettingCache;
};

const getValidColumnWidth = (
    column: any,
    cacheColumn?: SpotterTableColumnSetting,
    globalColumnResizableMinWidth?: number,
) => {
    return column.dataIndex && cacheColumn && cacheColumn.originWidth === column.width
        ? cacheColumn.width
        : // 当没有设定列宽时，默认使用全局的最小列宽
          column.width ?? column.resizable?.minWidth ?? globalColumnResizableMinWidth;
};

const transformOriginColumns = ({
    originColumns,
    getCache,
    columnResizable,
    drawerTrigger,
    resizedColumns,
}: { resizedColumns: any; originColumns: SptTableColumn[]; getCache: () => any } & Pick<
    SptTableProps<any, any>,
    'drawerTrigger'
> &
    Pick<SptTableProps<any, any>, 'columnResizable'>) =>
    originColumns.map((column, index) => {
        // 拷贝一份column配置，用于修改
        const transformedColumn = { ...column };
        // 从拖动缓存中获取列宽
        const resizeData =
            (column.dataIndex && resizedColumns[column.dataIndex.toString()]) ||
            resizedColumns[index.toString()];
        const columnWidth = getValidColumnWidth(
            transformedColumn,
            getCache()?.[transformedColumn.dataIndex as string],
            columnResizable?.minWidth,
        );

        let c: SptTableColumn = transformedColumn;
        if (!transformedColumn.hideInTable) {
            let width = columnWidth;
            if (resizeData) {
                const minWidth = columnResizable?.minWidth ?? 0;
                const newColumnWidth = columnWidth + (resizeData?.width ?? 0);
                // 新宽度不能小于最小默认宽度
                /**
                 * 这里会存在为负数的情况，因为列配置可以隐藏列，可导致 table 中只显示少数的列，此时，列会均匀分布在 table 中。
                 * 隐藏前，假设某一列宽储存的值为 90，隐藏后，由于均匀分布，页面渲染宽度超过 90，假设为 300，
                 * 此时向左调整列宽时，调整幅度为 -200，即 90 - 200 = -110，当恢复隐藏后，再调整就会出现 BUG，
                 * 故，提前判断为负时，重置为最小默认宽度。
                 */
                if (newColumnWidth < 0) {
                    width = minWidth ?? transformedColumn.width;
                } else {
                    width = newColumnWidth < minWidth ? minWidth : newColumnWidth;
                }
            }
            c = {
                ...transformedColumn,
                width,
            };
        }

        if (!(transformedColumn.drawerTrigger ?? drawerTrigger)) {
            return {
                ...c,
                className: classnames(transformedColumn.className, 'disable-drawer-trigger'),
                render: (node, ...rp) => (
                    <div
                        className={classnames('disabled-drawer-trigger-table-cell-wrapper', {
                            'items-start':
                                !transformedColumn.align || transformedColumn.align === 'left',
                            'items-center': transformedColumn.align === 'center',
                            'items-end': transformedColumn.align === 'right',
                        })}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        {(transformedColumn.render?.(node, ...rp) as ReactNode) || node}
                    </div>
                ),
            } as ProColumns;
        }
        return c;
    });

const SpotterTableBase: FC<SptTableProps<any, any, any>> = ({
    className,
    width = 0,
    fit = 'content',
    sticky = true,
    onRowDrawerChange: _onRowDrawerChange,
    onRowSelection,
    resetTableSearchParams = true,
    drawerTrigger = true,
    columnResizable: _columnResizable,
    cacheKey,
    params: propsParams,
    columns: _columns,
    enableColumnSetting = false,
    initColumnSettingList = [],
    columnGroupConf,
    showNewColumn = true,
    components: _components,
    onRow,
    request,
    search,
    // pagination,
    formRef,
    manualRequest,
    onReset: onPropsReset,
    actionRef: propsActionRef,
    form: searchForm,
    pagination: propsPagination,
    dataSource: propsDataSource,
    loading: propsLoading,
    inheritAction,
    toolbar: propsToolbar,
    toolBarRender: propsToolbarRender,
    debounceTime: propsDebounceTime,
    ...restProps
}) => {
    const { formColumns, tableColumns, tableOriginSortKeys } = useFilterSptTableColumns(_columns);
    const [remoteCache, setRemoteCache] = useState<SpotterTableColumnSetting | null>(null);
    const [isConfigLoading, setIsConfigLoading] = useState(true);
    const lastFetchedKey = useRef<string | null>(null);
    const onRowDrawerChange = useMemo(() => _onRowDrawerChange, []);
    const columnResizable = useMemo(
        () =>
            _columnResizable ?? {
                minWidth: 88,
                preferResizeWidth: false,
            },
        [_columnResizable],
    );
    const [formSearch, setFormSearch] = useMountMergeState<Record<string, any> | undefined>(() => {
        if (manualRequest || search !== false) {
            return undefined;
        }
        return {};
    });
    const manualRequestRef = useRef<any>(formSearch === undefined);

    const initFormRef = useRef<ProFormInstance>();
    const baseFormRef = formRef ?? initFormRef;

    const params = useMemo(() => {
        return {
            ...(propsParams || {}),
            ...(formSearch || {}),
        };
    }, [propsParams, formSearch]);

    // 获取loading
    const [loading, setLoading] = useMountMergeState<boolean>(false, {
        value: typeof propsLoading === 'object' ? propsLoading?.spinning : propsLoading,
        onChange: restProps.onLoadingChange,
    });

    const originComponents = useMemo(() => _components, []);
    const _cacheKey = useMemo(
        () => `${cacheKey ? `${cacheKey}_` : ''}spotter_table_${getAppBootData().appGroupCode}`,
        [],
    );
    // spotter table 组件在一次完整的生命周期中的唯一 id
    const _componentId = useMemo(() => nanoid(), []);
    const { routes } = useContext(SptComponentContext);
    const location = useLocation();
    const {
        getCache,
        setCache,
        cacheKey: cacheKeyWithRoute,
    } = useLocalCache<SpotterTableColumnSetting>(_cacheKey, {}, routes ?? [], location);

    useEffect(() => {
        const fetchConfig = async () => {
            if (
                enableColumnSetting &&
                window?.__SPOTTER_FE_CONFIG_API__?.tableConfig?.singleGet &&
                lastFetchedKey.current !== cacheKeyWithRoute
            ) {
                setIsConfigLoading(true);
                try {
                    const res =
                        await window.__SPOTTER_FE_CONFIG_API__.tableConfig.singleGet(
                            cacheKeyWithRoute,
                        );
                    if (res.success && res.data) {
                        setRemoteCache(res.data);
                        // 同步到 localcache
                        setCache(res.data);
                        lastFetchedKey.current = cacheKeyWithRoute;
                    }
                } catch (error) {
                    console.error('Failed to fetch table config:', error);
                } finally {
                    setIsConfigLoading(false);
                }
            } else {
                setIsConfigLoading(false);
            }
        };
        fetchConfig();
    }, [cacheKeyWithRoute, enableColumnSetting]);

    // y 轴滚动设置
    const { scrollY, fitClass } = useFit(fit);
    const { ResizingHeaderCell, ResizingIndicator, updateResizableColumns } = useResizable({
        key: _componentId,
        headerCell: originComponents?.header?.cell,
    });
    const [resizedColumns, setResizedColumns] = useState<
        Record<string, { oldWidth?: number; width: number }>
    >({});
    // 用于触发table组件的重新渲染
    const emitUpdateRef = useRef(dayjs().valueOf());
    // 获取当前的节点，用于获取内部table的样式
    const divRef = useRef<HTMLDivElement>(null);

    useActivate(() => {
        if (divRef.current?.querySelector('table')?.style.visibility === 'hidden') {
            // 当有隐藏的table时，强制触发整体组件的重新渲染
            emitUpdateRef.current = dayjs().valueOf();
        }
    });
    // 列配置排序展示数据
    const [columnSettingColumnSortKeys, setColumnSettingColumnSortKeys] = useState<
        SptTableColumn['dataIndex'][]
    >([]);

    // 原始列变化时，清空列宽调整的缓存，避免重复累计，导致宽度变化
    useMemo(() => {
        setResizedColumns({});
    }, [_columns]);

    useEffect(() => {
        eventBus.on(`resize_column_${_componentId}`, ({ columnKey, width }: any) => {
            setResizedColumns({
                [columnKey]: {
                    width,
                },
            });
        });

        return () => {
            eventBus.off(`resize_column_${_componentId}`);
        };
    }, []);

    const columns = useMemo(() => {
        const cacheData = getCache();

        // 处理列宽更新
        const processResizableColumns = (originColumns: SptTableColumn[]) => {
            return updateResizableColumns(
                transformOriginColumns({
                    originColumns,
                    getCache,
                    columnResizable,
                    drawerTrigger,
                    resizedColumns,
                }),
            );
        };

        const newOriginColumns = processResizableColumns(tableColumns);

        /**
         * 如果没有缓存数据，或者未启用列配置，或者启用了列配置但缓存中没有列配置数据，
         * 则直接返回未经过列配置排序处理的原始列。
         */
        if (
            !cacheData ||
            !enableColumnSetting ||
            (enableColumnSetting && !cacheData?.[ColumnSettingCacheField])
        ) {
            return newOriginColumns;
        }

        /******* 列配置缓存数据逻辑处理 START ********/
        const columnSettingCacheData: ColumnSettingCache = cacheData[ColumnSettingCacheField];
        const currentTableColumns = [...tableColumns];
        let currentColumnSortKeys = [];
        const sortColumns: SptTableColumn[] = [];

        // 兼容旧版数据结构
        if (!columnSettingCacheData?.defaultSortKeys) {
            return newOriginColumns;
        }

        // 当前被应用的列配置优先，否则走缓存中的
        currentColumnSortKeys = columnSettingColumnSortKeys.length
            ? columnSettingColumnSortKeys
            : columnSettingCacheData.defaultSortKeys;

        // 兼容旧版数据结构（旧版没有 originSortKeys 值），旧版数据不做处理
        if (columnSettingCacheData?.originSortKeys) {
            // diff 当前 table 原始排序 与 缓存中的原始排序，找出新增的列和移除的
            const { added, removed } = diffSortKeys(
                columnSettingCacheData.originSortKeys,
                tableOriginSortKeys,
            );
            // 新增的列，需要在列配置中添加
            if (added.length && showNewColumn) {
                currentColumnSortKeys = mergeAddSortKeys(
                    added,
                    currentColumnSortKeys,
                    tableColumns,
                );
            }
            // 移除的列，需要从列配置中移除
            if (removed.length) {
                currentColumnSortKeys = currentColumnSortKeys.filter(
                    (item) => !removed.includes(item),
                );
            }
        }

        /**
         * 这里的遍历是为了从原始列数组中，找出列配置已经选好的排序列 sortColumns
         */
        currentColumnSortKeys.forEach((dataIndex) => {
            // 从原始列数组中，找出当前表格内展示的列
            // 这里也把未定义 dataIndex 的列找出来，这些未定义 dataIndex 的列可能是操作列、或者其他选项列
            const foundItem = currentTableColumns.find(
                (item) => item.dataIndex === dataIndex || item.dataIndex === undefined,
            );
            // 保存起来
            foundItem && sortColumns.push({ ...foundItem });
        });

        return processResizableColumns(sortColumns);

        /******* 列配置缓存数据逻辑处理 END ********/
    }, [_columns, tableColumns, columnSettingColumnSortKeys, resizedColumns, remoteCache]);

    // 识别searchParams并插入
    const [searchParams] = useSearchParams();

    useEffect(() => {
        try {
            const params = searchParams.get('table_search_params');
            if (params) {
                const table_search_params = JSON.parse(decodeURIComponent(params));
                if (table_search_params.resetFields) {
                    baseFormRef.current?.resetFields();
                }
                baseFormRef.current?.setFieldsValue(table_search_params);
                baseFormRef.current?.submit();
            }
        } catch (error) {
            console.log(error);
        }
    }, [searchParams]);

    useEffect(() => {
        // 如果远程配置仍在加载中，则不执行任何操作。
        // 等待最终配置状态确定后再继续。
        if (isConfigLoading) {
            return;
        }
        // columns发生变化，对columns宽度配置进行缓存
        if (columns.length > 1) {
            // 读取列排序展示配置数据
            const cacheData = getCache();

            let __columnSetting__: ColumnSettingCache;
            let isNewColumnSetting = false;

            // 生成默认列排序数据
            const defaultSortKeys = generatorSortList(tableColumns, initColumnSettingList).map(
                (item) => item.dataIndex,
            );

            // 判断是否有列配置缓存
            if (
                cacheData &&
                cacheData[ColumnSettingCacheField] &&
                cacheData[ColumnSettingCacheField]?.defaultSortKeys // 兼容旧版数据结构，重置为新的
            ) {
                const columnSettingCacheData: ColumnSettingCache =
                    cacheData[ColumnSettingCacheField];
                const { currentSettingIndex, originSortKeys, settings } = columnSettingCacheData;

                // diff 当前 table 原始排序 与 缓存中的原始排序，找出新增的列和移除的
                // 若无缓存中的原始排序，则置空
                const { added, removed } = originSortKeys
                    ? diffSortKeys(originSortKeys, tableOriginSortKeys)
                    : { added: [], removed: [] };

                // 有已选预设，且有对应的值，则更新默认预设为已选预设的值
                if (currentSettingIndex > -1 && settings[currentSettingIndex]) {
                    columnSettingCacheData.defaultSortKeys = settings[currentSettingIndex].sortKeys;
                }
                // 在没有当前索引对应值时，设为默认索引，即： -1。（容错、兜底处理）
                else {
                    columnSettingCacheData.currentSettingIndex = -1;
                }
                columnSettingCacheData.originSortKeys = tableOriginSortKeys;

                if (added.length && showNewColumn) {
                    if (settings.length) {
                        columnSettingCacheData.settings = settings.map((item) => {
                            const sortKeys = mergeAddSortKeys(added, item.sortKeys, tableColumns);
                            const newItem = {
                                ...item,
                                sortKeys,
                            };
                            return newItem;
                        });
                    }
                    // 没有选择预设时，则直接更新为新的默认排序，否则在末尾追加新增
                    columnSettingCacheData.defaultSortKeys =
                        currentSettingIndex > -1
                            ? mergeAddSortKeys(
                                  added,
                                  columnSettingCacheData.defaultSortKeys,
                                  tableColumns,
                              )
                            : defaultSortKeys;

                    isNewColumnSetting = true;
                }
                if (removed.length) {
                    if (settings.length) {
                        columnSettingCacheData.settings = settings.map((item) => {
                            return {
                                ...item,
                                sortKeys: item.sortKeys.filter((key) => !removed.includes(key)),
                            };
                        });
                    }
                    columnSettingCacheData.defaultSortKeys =
                        columnSettingCacheData.defaultSortKeys.filter(
                            (key) => !removed.includes(key),
                        );

                    isNewColumnSetting = true;
                }

                __columnSetting__ = columnSettingCacheData;
            }
            // 没有列配置缓存时，生成默认值
            else {
                // 列配置生成默认值
                const defaultColumnSettingCacheData: ColumnSettingCache = {
                    currentSettingIndex: -1,
                    defaultSortKeys,
                    originSortKeys: tableOriginSortKeys,
                    settings: [],
                };
                __columnSetting__ = defaultColumnSettingCacheData;
                isNewColumnSetting = true;
            }

            const newCacheData = columns.reduce(
                (p, c, i) => {
                    // 只缓存有 dataIndex 的列宽度，因为在没有 dataIndex 会使用 index 作为 key，而我们后面修改顺序或者 column 数量发生变更时会存在问题
                    if (c.dataIndex && c.width) {
                        p[c.dataIndex as string] = {
                            /**
                             * 现在存在一个问题，改了代码里的 table 列宽以后，如果客户端有缓存，那么改动后的列宽并不会优先生效.
                             * 这在一些情况下会导致显示问题，所以补充了一个自动根据原始列宽和当前的代码列宽做判断后再增量覆盖缓存的方案，来让改动后的列宽优先生效，同时不会影响其他未改动的列宽的缓存
                             * */
                            originWidth:
                                /**
                                 * 这里优先使用数组索引去查找，提高效率。但是由于可能动态的变更 columns 的顺序和数量，所以使用数组索引进行查找并不严谨.
                                 * 故我们再增加一步对比 dataIndex，如果 dataIndex 不相同，那么说明错位了，则使用 find 来查找 dataIndex 相同的原始列
                                 */
                                _columns[i]?.dataIndex === c.dataIndex
                                    ? (_columns[i].width as number)
                                    : (_columns.find(({ dataIndex }) => dataIndex === c.dataIndex)
                                          ?.width as number),
                            width: c.width as number,
                        };
                    }
                    return p;
                },
                { [ColumnSettingCacheField]: __columnSetting__ } as SpotterTableColumnSetting,
            );

            // 本地缓存
            setCache(newCacheData);

            // 有新的列配置时，或者列配置排序展示数据有变化时，调用接口缓存
            if (enableColumnSetting && (isNewColumnSetting || columnSettingColumnSortKeys.length)) {
                // 调用接口缓存
                try {
                    window?.__SPOTTER_FE_CONFIG_API__?.tableConfig.singleSet(
                        cacheKeyWithRoute,
                        newCacheData,
                    );
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }, [columns, isConfigLoading]);

    const [pagination, setPagination] = useState<{ current: number; pageSize: number }>({
        current:
            (propsPagination && (propsPagination?.current ?? propsPagination?.defaultCurrent)) || 1,
        pageSize:
            (propsPagination && (propsPagination?.pageSize ?? propsPagination?.defaultPageSize)) ||
            20,
    });

    const [paginationInfo, setPaginationInfo] = useState({
        total: (propsPagination && propsPagination.total) || 0,
        // 是否已经加载过数据
        loaded: false,
    });

    const sorter = useRef<any>({});
    const filter = useRef<any>({});

    /** 设置默认排序  */
    useEffect(() => {
        const { sort } = parseDefaultColumnConfig(columns);
        sorter.current = sort;
    }, []);

    const [dataSource, setDataSource] = useState<any>(
        propsDataSource
            ? propsPagination !== false
                ? propsDataSource?.slice(
                      (pagination.current - 1) * pagination.pageSize,
                      pagination.current * pagination.pageSize,
                  )
                : propsDataSource
            : [],
    );

    useEffect(() => {
        setPaginationInfo({
            ...paginationInfo,
            loaded: true,
            total: propsDataSource?.length ?? 0,
        });
        setDataSource(propsDataSource);
    }, [propsDataSource]);

    const newDataSource = useMemo(() => {
        const cur = (propsPagination && propsPagination?.current) || pagination.current;
        const size = (propsPagination && propsPagination?.pageSize) || pagination.pageSize;

        return dataSource
            ? propsPagination !== false
                ? dataSource?.length > size
                    ? dataSource?.slice((cur - 1) * size, cur * size)
                    : dataSource
                : dataSource
            : [];
    }, [dataSource, pagination, propsPagination]);

    const queryData = async (params: any) => {
        if (!request) return;
        if (manualRequestRef.current) {
            manualRequestRef.current = false;
            return;
        }
        setLoading(true);
        try {
            const { data, total } =
                (await request?.(
                    params,
                    sorter.current, // sort
                    filter.current, // filter
                )) ?? {};
            setDataSource(data || []);
            setPaginationInfo({
                ...paginationInfo,
                loaded: true,
                total: total || 0,
            });
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const requestFinally = useRefFunction(() => {
        unstable_batchedUpdates(() => {
            setLoading(false);
        });
    });

    /**
     * 用于保存 AbortController 实例的引用，方便需要时进行请求的取消操作
     * @type {React.MutableRefObject<AbortController | null>}
     */
    const abortRef = useRef<AbortController | null>(null);

    const fetchListData = useDebounceFn(async (params: any) => {
        const abort = new AbortController();
        abortRef.current = abort;

        try {
            const msg = (await Promise.race([
                queryData(params),
                new Promise((_, reject) => {
                    abortRef.current?.signal.addEventListener('abort', () => {
                        reject('aborted');
                        // 结束请求，并且清空loading控制
                        fetchListData.cancel();
                        requestFinally();
                    });
                }),
            ])) as any;
            if (abort.signal.aborted) return;

            return msg;
        } catch (error) {
            if (error === 'aborted') {
                return;
            }
            throw error;
        }
    }, propsDebounceTime ?? 30);
    /**
     * 取消请求
     */
    const abortFetch = () => {
        abortRef.current?.abort();
        fetchListData.cancel();
        requestFinally();
    };

    const reload = async (innerParams?: any) => {
        await fetchListData.run({
            current: pagination.current,
            pageSize: pagination.pageSize,
            ...omit(params, ['_timestamp']),
            ...(innerParams ?? {}),
        });
    };

    const reloadWithPagination = async (nextPagination: any) => {
        await fetchListData.run({
            current: nextPagination.current,
            pageSize: nextPagination.pageSize,
            ...omit(params, ['_timestamp']),
        });
    };

    useEffect(() => {
        // TODO: 清理request副作用
        abortFetch();
        if (!isConfigLoading) {
            request && reload();
        }
        if (formSearch !== undefined) {
            // 如果 manual 标志未设置，则将 manualRequestRef 设置为 false。
            // 用于跟踪当前的请求是否是手动发起的。
            manualRequestRef.current = false;
        }
    }, [stringify(params), formSearch, isConfigLoading]);

    const onFormSearchSubmit = useRefFunction((values: any) => {
        setPagination({
            ...pagination,
            current: 1,
        });
        setFormSearch(values);
    });

    const searchKeyMap = useMemo(() => {
        if (!columns && !formColumns) {
            return {};
        }
        const searchKeyMap: Record<string, any> = {};
        const columnsList = [...formColumns, ...columns];
        for (const item of columnsList) {
            searchKeyMap[`${item.key || item.dataIndex}`] = {
                transform:
                    item?.search?.transform ??
                    searchKeyMap[`${item.key || item.dataIndex}`]?.transform,
                fieldProps: item?.fieldProps, // 如果存在重复的key，后者会覆盖前者，如果后面没有值，则使用前面的值
            };
        }
        return searchKeyMap;
    }, [columns, formColumns]);

    // 拦截ActionRef
    const actionRef = useRef<ActionType>();
    useImperativeHandle(propsActionRef, () => ({
        ...((actionRef.current || {}) as any),
        reset: async () => {
            baseFormRef?.current?.resetFields();
            const values = omitUndefined(baseFormRef?.current?.getFieldsValue?.() || {});
            const nextPagination =
                propsPagination !== false
                    ? {
                          ...pagination,
                          current: 1,
                      }
                    : undefined;
            propsPagination !== false && setPagination(nextPagination ?? pagination);
            const searchValues = transformKey(values, searchKeyMap);
            setFormSearch(searchValues);
            baseFormRef?.current?.submit();
        },
        reload: async (resetPageIndex?: boolean) => {
            if (resetPageIndex) {
                const nextPagination = {
                    ...pagination,
                    current: 1,
                };
                setPagination(nextPagination);
                reloadWithPagination(nextPagination);
            } else {
                reload();
            }
        },
        reloadAndRest: () => {
            const nextPagination = {
                ...pagination,
                current: 1,
            };
            setPagination(nextPagination);
            request && reloadWithPagination(nextPagination);
        },
    }));

    const onPaginationChange = useRefFunction((page: number, pageSize: number) => {
        const nextPagination = {
            ...pagination,
            current: page,
            pageSize,
        };
        setPagination(nextPagination);

        request && reloadWithPagination(nextPagination);

        if (propsPagination !== false && propsPagination?.onChange) {
            propsPagination.onChange(page, pageSize);
        }
    });

    const onTableChange = useRefFunction((_pagination, _filter, _sorter) => {
        const nextSorter =
            _sorter && Object.keys(_sorter).length > 0 && _sorter.order
                ? {
                      [typeof _sorter?.column?.sorter === 'string'
                          ? _sorter?.column?.sorter
                          : _sorter?.columnKey || _sorter?.field || _sorter?.column?.dataIndex]:
                          _sorter.order,
                  }
                : undefined;
        sorter.current = nextSorter;
        request && reload();
    });

    const tableAction = useContext(SptPageContainerContext);

    // 列配置渲染节点
    const columnSettingNode = useMemo(
        () =>
            enableColumnSetting
                ? [
                      <ColumnSetting
                          key="columnSetting"
                          cacheKey={_cacheKey}
                          initColumnSettingList={initColumnSettingList}
                          columns={[..._columns]}
                          columnGroupConf={columnGroupConf}
                          onApply={(newColumnKeys) => {
                              // 应用前，清空当前已拖拽调整的列宽缓存
                              setResizedColumns({});
                              setColumnSettingColumnSortKeys(newColumnKeys);
                          }}
                      />,
                  ]
                : [],
        [_columns, enableColumnSetting],
    );

    const toolbar = useMemo(() => {
        if (!inheritAction || propsToolbarRender) return propsToolbar;
        const { actions = [], settings = [], ...restToolbarProps } = propsToolbar ?? {};

        const tableActions = [
            actions?.length > 0 || settings?.length > 0 ? (
                <div key="spt-table-global-divider" className="spt-table-global-divider" />
            ) : undefined,
            ...(tableAction?.tableAction ?? []),
        ];

        return {
            ...restToolbarProps,
            actions: [
                ...actions,
                ...(tableAction?.tableAction && tableAction?.tableAction?.length > 0
                    ? tableActions
                    : []),
            ]?.filter((item) => item),
            settings: settings,
        };
    }, [propsToolbar, propsToolbarRender, tableAction?.tableAction]);

    const toolbarRender = useCallback<Exclude<typeof propsToolbarRender, undefined>>(
        (...args) => {
            if (!inheritAction) return propsToolbarRender?.(...args) ?? [];
            const actions = propsToolbarRender?.(...args) ?? [];
            const tableActions = [
                actions?.length > 0 ? (
                    <div key="spt-table-global-divider" className="spt-table-global-divider" />
                ) : undefined,
                ...(tableAction?.tableAction ?? []),
            ];

            return [
                ...actions,
                ...(tableAction?.tableAction && tableAction?.tableAction?.length > 0
                    ? tableActions
                    : []),
            ]; // 防止空元素
        },
        [propsToolbarRender, tableAction?.tableAction],
    );
    const tableToolbar = useMemo(
        () => ({
            ...toolbar,
            settings: toolbar?.settings
                ? toolbar.settings?.concat(columnSettingNode)
                : columnSettingNode,
        }),
        [toolbar, columnSettingNode],
    );

    return (
        <div
            className={classNames('spt-table-wrap', fitClass, className)}
            ref={divRef}
            key={emitUpdateRef.current}
        >
            {search === false ? null : (
                <Filter
                    action={actionRef}
                    loading={!!loading}
                    columns={[...formColumns, ...columns]}
                    formRef={baseFormRef}
                    form={searchForm}
                    search={search}
                    manualRequest={manualRequest}
                    type={restProps.type || 'table'}
                    onSubmit={restProps.onSubmit}
                    onReset={onPropsReset}
                    onFormSearchSubmit={onFormSearchSubmit}
                    searchKeyMap={searchKeyMap}
                    resetTableSearchParams={resetTableSearchParams}
                />
            )}
            <Spin spinning={loading || isConfigLoading}>
                <Table
                    columns={columns}
                    width={width}
                    sticky={sticky}
                    fit={fit}
                    fitClass={fitClass}
                    scrollY={scrollY}
                    onRow={onRow}
                    className={className}
                    componentId={_componentId}
                    cacheKeyWithRoute={cacheKeyWithRoute}
                    ResizingIndicator={ResizingIndicator}
                    onRowSelection={onRowSelection}
                    onRowDrawerChange={onRowDrawerChange}
                    ResizingHeaderCell={ResizingHeaderCell}
                    dataSource={newDataSource}
                    onChange={onTableChange}
                    components={originComponents}
                    pagination={propsPagination}
                    toolbar={tableToolbar}
                    toolBarRender={toolbarRender}
                    // TODO: DON'T WRITE LIKE THIS. IT'S NOT A GOOD PRACTICE
                    {...(restProps as any)}
                />
            </Spin>
            {paginationInfo.loaded && propsPagination !== false ? (
                <Pagination
                    {...pagination}
                    total={paginationInfo.total}
                    pageSize={pagination.pageSize}
                    {...(propsPagination ?? {})}
                    onChange={onPaginationChange}
                />
            ) : null}
        </div>
    );
};

const SptTable: FC<SptTableProps<any, any, any>> = ({ ...props }) => {
    return (
        <SptComponentProvider>
            <SpotterTableBase {...props} />
        </SptComponentProvider>
    );
};

export default SptTable;
