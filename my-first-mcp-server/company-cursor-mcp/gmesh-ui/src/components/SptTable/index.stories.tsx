import { Meta, StoryObj } from '@storybook/react';
import React, { Key, useEffect, useRef, useState } from 'react';
import SptTable, { SptProColumns } from '.';
import { ActionType, ProColumns, ProForm, ProFormInstance } from '@ant-design/pro-components';
import SptPageContainer from '../SptPageContainer';
import { TIME_DAY_FORMAT, TIME_MONTH_FORMAT, sortQueryFormatter, tzTime, tzTimeFormatter, tzTimestampRangeTransformer, useMount } from '@spotter/app-client-toolkit';
import SptSearchSelect from '../SptSearchSelect';
import { Button, Modal, Space, Tooltip } from 'antd';
import { useMatches } from 'react-router-dom';
import SptTooltipIcon from '../SptTooltipIcon';
import { ColumnGroupConf } from './ColumnSetting/typing';
import SptModal from '../Modal';

const meta = {
    title: 'Components/数据展示/SptTable',
    component: SptTable,
    tags: ['autodocs'],
} satisfies Meta<typeof SptTable>;

export default meta;

type Story = StoryObj<typeof SptTable>;

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

enum PAYMENT_TYPE_ENUM {
    'cash' = '现金',
    'transfer' = '转账',
    'wechat' = '微信',
    'alipay' = '支付宝',
    'other' = '其他',
}

const PAYMENT_TYPE_OPTIONS = {
    [PAYMENT_TYPE_ENUM.cash]: {
        text: '现金',
        status: 'Success',
    },
    [PAYMENT_TYPE_ENUM.transfer]: {
        text: '转账',
        status: 'Processing',
    },
    [PAYMENT_TYPE_ENUM.wechat]: {
        text: '微信',
        status: 'Error',
    },
    [PAYMENT_TYPE_ENUM.alipay]: {
        text: '支付宝',
        status: 'Warning',
    },
    [PAYMENT_TYPE_ENUM.other]: {
        text: '其他',
        status: 'Default',
    },
};

const columns: SptProColumns<any>[] = [
    {
        dataIndex: 'reconciliationCode',
        title: '款项编号',
        width: 120,
        fixed: 'left'
    },
    {
        dataIndex: 'reconciliationType',
        title: '款项类型',
        width: 200,
        fieldProps: () => {
            return {
                placeholder: '请输入款项类型, test fieldProps with function',
            };
        },
         fixed: 'left'
    },
    {
        dataIndex: 'status',
        title: '状态',
        width: 200,
        valueType: 'select',
        fieldProps: {
            options: [
                {
                    label: '未确认',
                    value: 'unconfirmed',
                },
                {
                    label: '已确认',
                    value: 'confirmed',
                },
            ],
        },
        disableColumnHide: true,
    },
    {
        dataIndex: 'reconciliationDate',
        title: '对账日期',
        width: 200,
        // initialValue: [
        //     '2023-01-01',
        //     '2023-01-03'
        // ],
        formItemProps: {
            initialValue: ['2023-01-01', '2023-01-03'],
        },
        valueType: 'dateRange',
        search: {
            transform: tzTimestampRangeTransformer([
                'reconciliationDateStart',
                'reconciliationDateEnd',
            ]),
        },
    },
    {
        dataIndex: 'reconciliationDateMonth',
        title: '对账月份',
        width: 200,
        valueType: 'dateMonthRange',
        search: {
            transform: (values) => {
                console.log('transform =', values);

                return { monthStartTime: values[0], monthEndTime: values[1] };
            },
        },
        fixed: 'right'
    },
    {
        dataIndex: 'treeSelect',
        title: '树形选择器更新',
        valueType: 'treeSelect',
        fieldProps: {
            multiple: true,
            allowClear: true,
            maxTagCount: 'responsive',
            placeholder: 'test 测试树形选择器placeholder',
        },
        request: async () => {
            return [
                {
                    title: 'Node1',
                    value: '0-0',
                    children: [
                        {
                            title: 'Child Node1',
                            value: '0-0-0',
                        },
                    ],
                },
                {
                    title: 'Node2',
                    value: '0-1',
                    children: [
                        {
                            title: 'Child Node3',
                            value: '0-1-0',
                        },
                        {
                            title: 'Child Node4',
                            value: '0-1-1',
                        },
                        {
                            title: 'Child Node5',
                            value: '0-1-2',
                        },
                    ],
                },
            ];
        },
    },
    {
        dataIndex: 'paymentType',
        title: '付款方式',
        valueEnum: PAYMENT_TYPE_OPTIONS,
    },
    {
        search: false,
        dataIndex: 'shippingWindow',
        title: "发货窗口",
        width: 200,
        valueType: 'dateRange',
        sorter: 'windowEnd',
        render(_, r) {
            return `${tzTimeFormatter(r.windowStart, TIME_DAY_FORMAT)}~${tzTimeFormatter(
                r.windowEnd,
                TIME_DAY_FORMAT,
            )}`;
        },
        disableColumnHide: true,
    },
    {
        dataIndex: 'companyCode',
        title: '公司',
        formItemProps: {
            name: 'companyId',
        },
        valueType: 'company',
        fixed: 'left'
    },
    {
        dataIndex: 'vendorCode',
        title: 'Vendor Code',
        valueType: 'vendorCode',
        fixed: true
    },
    {
        dataIndex: 'formRenderItem',
        title: 'renderFormItem',
        tooltip: 'xxxxxxx',
        fieldProps: {
            options: [
                {
                    label: 'test',
                    value: 'test',
                },
            ],
        },
        renderFormItem: () => <SptSearchSelect />,
    },
    {
        dataIndex: 'cascader',
        title: (<><span style={{marginRight: 4}}>级联选择器</span>
        <Tooltip title='级联选择器级联选择器级联选择器级联选择器级联选择器'>
            <span>
                <SptTooltipIcon />
            </span>
        </Tooltip></>),
        valueType: 'cascader',
        fieldProps: {
            options: [
                {
                    value: 'zhejiang',
                    label: 'Zhejiang',
                    children: [
                        {
                            value: 'hangzhou',
                            label: 'Hangzhou',
                            children: [
                                {
                                    value: 'xihu',
                                    label: 'West Lake',
                                },
                            ],
                        },
                    ],
                },
                {
                    value: 'jiangsu',
                    label: 'Jiangsu',
                    children: [
                        {
                            value: 'nanjing',
                            label: 'Nanjing',
                            children: [
                                {
                                    value: 'zhonghuamen',
                                    label: 'Zhong Hua Men',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    },
    {
        dataIndex: 'action',
        title: '操作',
        width: 100,
        fixed: 'right',
        search: false,
        valueType: 'option',
        render: () => [<a key="edit">编辑</a>, <a key="delete">删除</a>],
    },
];

const mock = async ({ pageSize, current }: any, timeout: number = 200) => {
    await sleep(timeout);
    return {
        page: 1,
        total: 20000,
        data: [
            ...Array.from({ length: pageSize }).map((_, index) => {
                return {
                    reconciliationCode: `00${current * pageSize + index + 5}`,
                    reconciliationType: `类型${current * pageSize + index + 5}`,
                    status: 'confirmed',
                };
            }),]
    };
};

export const Default: Story = {
    name: '表格示例',
    args: {
        cacheKey: 'unconfirmed_warehouse_offer',
    },
    render: ({ cacheKey }) => {
        const actionRef = useRef<ActionType>();
        console.log('cacheKey =', cacheKey);
        const formRef = useRef<ProFormInstance>();

        useEffect(() => {
            // 多次触发reset，测试是否会多次请求，或者不发起请求
            console.log("触发reset!!!")
            actionRef.current?.reset?.();
        }, []);

        const columnGroupConf: ColumnGroupConf = [
            {
                name: '基础信息',
                dataIndexList: [],
            },
            {
                name: '账单信息',
                dataIndexList: [],
            }
        ]

        return (
            <SptPageContainer title="月度对账单">
                <Button
                    onClick={() => {
                        actionRef.current?.reset?.();
                    }}
                >
                    重置测试
                </Button>
                <SptTable
                    rowKey="reconciliationCode"
                    enableColumnSetting
                    initColumnSettingList={['companyCode','reconciliationCode','reconciliationType',  'paymentType']}
                    columnGroupConf={columnGroupConf}
                    cacheKey={cacheKey}
                    columns={columns}
                    actionRef={actionRef}
                    formRef={formRef}
                    request={async (values, sort) => {
                        console.log('DEBUG: Request values =', values);
                        console.log("Sort =", sort);
                        const res = await mock({
                            current: values.current,
                            pageSize: values.pageSize,
                        }, 0);
                        return {
                            success: true,
                            total: res.total,
                            data: res.data,
                        };
                    }}
                    toolBarRender={() => [
                        <Button
                            key="test_searchParams1"
                            onClick={() => {
                                
                            }}
                        >
                            测试_searchParams1
                        </Button>,
                        // <ColumnSetting
                        //     key="test_columnSetting"
                        //     columns={columns}
                        //     selectedColumns={columns}
                        // />,
                        <Button
                            key="test_searchValues2"
                            onClick={() => {
                                
                            }}
                        >
                            测试_searchParams2
                        </Button>,
                    ]}
                />
            </SptPageContainer>
        );
    },
};

export const ManualRequest: Story = {
    name: 'ManualRequest',
    args: {
        cacheKey: 'unconfirmed_warehouse_offer_2',
    },
    render: ({ cacheKey }) => {
        const [search, setSearch] = React.useState<string>('request not triggered!');
        const columns: ProColumns<any>[] = [
            {
                dataIndex: 'reconciliationCode',
                title: '款项编号',
                width: 120,
            },
            {
                dataIndex: 'reconciliationType',
                title: '款项类型',
                width: 200,
                fieldProps: {},
            },
            {
                dataIndex: 'status',
                title: '状态',
                width: 200,
                valueType: 'select',
                fieldProps: {
                    options: [
                        {
                            label: '未确认',
                            value: 'unconfirmed',
                        },
                        {
                            label: '已确认',
                            value: 'confirmed',
                        },
                    ],
                },
            },
            {
                dataIndex: 'reconciliationDate',
                title: '对账日期',
                width: 200,
                valueType: 'dateRange',
                search: {
                    transform: tzTimestampRangeTransformer(['start', 'end']),
                },
            },
            {
                dataIndex: 'paymentType',
                title: '付款方式',
                valueEnum: PAYMENT_TYPE_OPTIONS,
            },
            {
                dataIndex: 'action',
                title: '操作',
                width: 100,
                fixed: 'right',
                search: false,
                valueType: 'option',
                render: () => [<a key="edit">编辑</a>, <a key="delete">删除</a>],
            },
        ];

        const mock = async () => {
            // await sleep(1000);
            return {
                page: 1,
                total: 20,
                data: [
                    {
                        reconciliationCode: '001',
                        reconciliationType: '类型1',
                        status: 'unconfirmed',
                        paymentType: PAYMENT_TYPE_ENUM.transfer,
                    },
                    {
                        reconciliationCode: '002',
                        reconciliationType: '类型2',
                        status: 'confirmed',
                        paymentType: PAYMENT_TYPE_ENUM.cash,
                    },
                    {
                        reconciliationCode: '003',
                        reconciliationType: '类型3',
                        status: 'confirmed',
                        paymentType: PAYMENT_TYPE_ENUM.transfer,
                    },
                    {
                        reconciliationCode: '004',
                        reconciliationType: '类型4',
                        status: 'confirmed',
                        paymentType: PAYMENT_TYPE_ENUM.wechat,
                    },
                    {
                        reconciliationCode: '005',
                        reconciliationType: '类型5',
                        status: 'confirmed',
                    },
                    {
                        reconciliationCode: '006',
                        reconciliationType: '类型6',
                        status: 'confirmed',
                    },
                    {
                        reconciliationCode: '007',
                        reconciliationType: '类型7',
                        status: 'confirmed',
                    },
                    {
                        reconciliationCode: '008',
                        reconciliationType: '类型8',
                        status: 'confirmed',
                    },
                    {
                        reconciliationCode: '009',
                        reconciliationType: '类型9',
                        status: 'confirmed',
                    },
                    {
                        reconciliationCode: '010',
                        reconciliationType: '类型10',
                        status: 'confirmed',
                    },
                ],
            };
        };

        return (
            <SptPageContainer title="月度对账单">
                {search}
                <SptTable
                    cacheKey={cacheKey}
                    columns={columns}
                    manualRequest
                    request={async () => {
                        setSearch('request triggered!');
                        const res = await mock();
                        return {
                            success: true,
                            total: res.total,
                            data: res.data,
                        };
                    }}
                />
            </SptPageContainer>
        );
    },
    // play: async ({ canvasElement, step }) => {
    //     const canvas = within(canvasElement);

    //     await step('等待加载完成', async () => {
    //         await canvas.findByText('月度对账单');
    //     });

    //     await step('判断是否触发第一次请求', async () => {
    //         await expect(canvas.findByText('request not triggered!')).toBeDefined();
    //     });
    // },
};


export const ActionRef: Story = {
    name: '使用 ActionRef',
    args: {
        cacheKey: 'action_ref_table',
    },
    render: ({ cacheKey }) => {
        const actionRef = useRef<ActionType>();

        return (
            <SptPageContainer title="月度对账单">
                <Space>
                    <Button
                        onClick={() => {
                            actionRef.current?.reset?.();
                        }}
                    >
                        reset
                    </Button>
                    <Button
                        onClick={() => {
                            actionRef.current?.reloadAndRest?.();
                        }}
                    >
                        reloadAndRest
                    </Button>
                    <Button
                        onClick={() => {
                            actionRef.current?.reload?.();
                        }}
                    >
                        reload
                    </Button>
                    <Button
                        onClick={() => {
                            actionRef.current?.reload?.(true);
                        }}
                    >
                        reload true
                    </Button>
                </Space>
                <SptTable
                    cacheKey={cacheKey}
                    columns={columns}
                    actionRef={actionRef}
                    request={async (values) => {
                        console.log('DEBUG: Request values =', values);
                        const res = await mock({
                            current: values.current,
                            pageSize: values.pageSize,
                        });
                        return {
                            success: true,
                            total: res.total,
                            data: res.data,
                        };
                    }}
                />
            </SptPageContainer>
        );
    },
}

export const DataSource: Story = {
    name: '使用 DataSource',
    args: {
        cacheKey: 'spt-table-datasource',
    },
    render: ({ cacheKey }) => {
        const actionRef = useRef<ActionType>();
        const [dataSource, setDataSource] = useState<any[] | undefined>([]);

        const queryData = async () => {
            const res = await mock({
                current: 1,
                pageSize: 100,
            });

            setDataSource(res?.data);
        }

        useMount(() => {
            queryData();
        })
        const count = useRef(0);
        console.log("执行次数", count.current++)

        return (
            <SptPageContainer title="DataSource 数据测试">
                <Space>
                    <Button
                        onClick={() => {
                            actionRef.current?.reset?.();
                        }}
                    >
                        reset
                    </Button>
                    <Button
                        onClick={() => {
                            actionRef.current?.reloadAndRest?.();
                        }}
                    >
                        reloadAndRest
                    </Button>
                    <Button
                        onClick={() => {
                            actionRef.current?.reload?.();
                        }}
                    >
                        reload
                    </Button>
                    <Button
                        onClick={() => {
                            actionRef.current?.reload?.(true);
                        }}
                    >
                        reload true
                    </Button>
                    <Button
                        onClick={() => {
                            setDataSource(undefined);
                        }}
                    >清空DataSource测试</Button>
                </Space>
                <SptTable
                    cacheKey={cacheKey}
                    columns={columns}
                    actionRef={actionRef}
                    dataSource={dataSource}
                    onSubmit={(values) => {
                        console.log("Values =", values);
                    }}
                />
            </SptPageContainer>
        );
    },
}

export const Sorter: Story = {
    name: '表格排序',
    args: {
        cacheKey: 'spt-table-sort',
    },
    render: ({ cacheKey }) => {
        const actionRef = useRef<ActionType>();
        const formRef = useRef<ProFormInstance>();

        return (
            <SptPageContainer title="排序功能测试">
                <Button type="primary" onClick={() => {
                    const res = formRef.current?.getFieldsValue()
                    console.log("RES =", res);
                }}>
                    获取表单数据
                </Button>
                <SptTable
                    cacheKey={cacheKey}
                    formRef={formRef}
                    columns={[
                        {
                            dataIndex: 'key1',
                            title: '基础排序',
                            sorter: true,
                        },
                        {
                            dataIndex: 'key2',
                            title: '默认排序',
                            sorter: true,
                            defaultSortOrder: 'descend',
                        }
                    ]}
                    actionRef={actionRef}
                    request={async (values, sort) => {
                        console.log('DEBUG: Request values =', values, sortQueryFormatter(sort));
                        const res = await mock({
                            current: values.current,
                            pageSize: values.pageSize,
                        });
                        return {
                            success: true,
                            total: res.total,
                            data: res.data,
                        };
                    }}
                    onSubmit={(values) => {
                        console.log("Values =", values);
                    }}
                />
            </SptPageContainer>
        );
    },
}

export const Pagination: Story = {
    name: '自定义分页',
    args: {
        cacheKey: 'spt-table-pagination-custom',
    },
    render: ({ cacheKey }) => {
        const actionRef = useRef<ActionType>();
        return (
            <SptPageContainer title="自定义分页 - 200条">
                <SptTable
                    cacheKey={cacheKey}
                    columns={columns}
                    actionRef={actionRef}
                    pagination={{
                        pageSize: 200,
                    }}
                    request={async (values) => {
                        console.log('DEBUG: Request values =', values);
                        const res = await mock({
                            current: values.current,
                            pageSize: values.pageSize,
                        });
                        return {
                            success: true,
                            total: res.total,
                            data: res.data,
                        };
                    }}
                />
            </SptPageContainer>
        );
    },
};

export const RowSelection: Story = {
    name: 'RowSelection',
    args: {
        cacheKey: 'spt-table-row-selection',
    },
    render: ({ cacheKey }) => {
        const actionRef = useRef<ActionType>();
        const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
        const [selectedRows, setSelectedRows] = useState<any>([]);
        console.log("selectedRows =", selectedRows);

        return (
            <SptPageContainer title="RowSelection">
                <SptTable
                    rowKey="reconciliationCode"
                    cacheKey={cacheKey}
                    columns={columns}
                    actionRef={actionRef}
                    rowSelection={{
                        selectedRowKeys: selectedKeys,
                        onChange: (keys, rows) => {
                            setSelectedKeys(keys);
                            setSelectedRows(rows);
                        },
                    }}
                    request={async (values) => {
                        console.log('DEBUG: Request values =', values);
                        const res = await mock({
                            current: values.current,
                            pageSize: values.pageSize,
                        });
                        return {
                            success: true,
                            total: res.total,
                            data: res.data,
                        };
                    }}
                />
            </SptPageContainer>
        );
    },
};


export const Editable: Story = {
    name: '可编辑表格示例',
    args: {
        cacheKey: 'spt-table-editable',
    },
    render: ({ cacheKey }) => {
        const actionRef = useRef<ActionType>();
        const [dataSource, setDataSource] = useState<any[]>([]);

        const queryData = async () => {
            const res = await mock({
                current: 1,
                pageSize: 100,
            });

            setDataSource(res?.data);
        }

        useMount(() => {
            queryData();
        })
        const count = useRef(0);
        console.log("执行次数", count.current++)

        return (
            <SptPageContainer title="DataSource 数据测试">
                <Space>
                    <Button onClick={() => {
                        setDataSource([...dataSource, {
                            reconciliationCode: `00${dataSource.length + 1}`,
                            reconciliationType: `类型${dataSource.length + 1}`,
                            status: 'confirmed',
                        }])
                    }}>
                        新增一行
                    </Button>
                </Space>
                <SptTable
                    cacheKey={cacheKey}
                    columns={columns}
                    actionRef={actionRef}
                    dataSource={dataSource}
                    pagination={false}
                />
            </SptPageContainer>
        );
    },
}


export const Search: Story = {
    name: '不带筛选区表格',
    args: {
        cacheKey: 'no_filter_table',
    },
    render: ({ cacheKey }) => {
        const actionRef = useRef<ActionType>();
        console.log('cacheKey =', cacheKey);
        return (
            <SptPageContainer title="不带筛选区表格">
                <Button
                    onClick={() => {
                        actionRef.current?.reset?.();
                    }}
                >
                    重置测试
                </Button>
                <SptTable
                    rowKey="reconciliationCode"
                    cacheKey={cacheKey}
                    columns={columns}
                    search={false}
                    actionRef={actionRef}
                    request={async (values) => {
                        console.log('DEBUG: Request values =', values);
                        const res = await mock({
                            current: values.current,
                            pageSize: values.pageSize,
                        });
                        return {
                            success: true,
                            total: res.total,
                            data: res.data,
                        };
                    }}
                />
            </SptPageContainer>
        );
    },
};

export const Expandable: Story = {
    name: '可展开表格',
    args: {
        cacheKey: 'expandable_table_cache_key',
    },
    render: ({ cacheKey }) => {
        const [expandedRowKeys, setExpandedRowKeys] = useState<Key[]>([]);
        const actionRef = useRef<ActionType>();
        const [payload] = useState({ test: 'hello' });
        const expandedRowRender = (record: any, _index: number, _indent: number, expanded: boolean) => {
            return expanded ? (
                <SptTable
                    rowKey="reconciliationCode"
                    cacheKey={cacheKey}
                    columns={columns}
                    search={false}
                    params={{ payload, reconciliationCode: record?.reconciliationCode }}
                    actionRef={actionRef}
                    request={async (values) => {
                        console.log('DEBUG: Children Request values =', values);
                        const res = await mock({
                            current: values.current,
                            pageSize: values.pageSize,
                        });
                        return {
                            success: true,
                            total: res.total,
                            data: res.data,
                        };
                    }}
                />
            ) : null
        }
        return (
            <SptPageContainer title="可展开表格">
                <SptTable
                    rowKey="reconciliationCode"
                    expandable={{
                        expandedRowRender,
                        expandedRowKeys,
                        onExpand: (expanded, record) => {
                            expanded ? setExpandedRowKeys([record.reconciliationCode]) : setExpandedRowKeys([]);
                        },
                    }}
                    cacheKey={cacheKey}
                    columns={columns}
                    actionRef={actionRef}
                    request={async (values) => {
                        console.log('DEBUG: Request values =', values);
                        const res = await mock({
                            current: values.current,
                            pageSize: values.pageSize,
                        });
                        return {
                            success: true,
                            total: res.total,
                            data: res.data,
                        };
                    }}
                />
            </SptPageContainer>
        );
    },
};

export const isKeyPressSubmit: Story = {
    name: 'isKeyPressSubmit',
    args: {
        cacheKey: 'no_filter_table',
    },
    render: ({ cacheKey }) => {
        const actionRef = useRef<ActionType>();
        console.log('cacheKey =', cacheKey);
        return (
            <SptPageContainer title="isKeyPressSubmit">
                <Button
                    onClick={() => {
                        actionRef.current?.reset?.();
                    }}
                >
                    重置测试
                </Button>
                <SptTable
                    rowKey="reconciliationCode"
                    cacheKey={cacheKey}
                    columns={columns}
                    actionRef={actionRef}
                    request={async (values) => {
                        console.log('DEBUG: Request values =', values);
                        const res = await mock({
                            current: values.current,
                            pageSize: values.pageSize,
                        });
                        return {
                            success: true,
                            total: res.total,
                            data: res.data,
                        };
                    }}
                    form={{
                        isKeyPressSubmit: false,
                    }}
                />
            </SptPageContainer>
        );
    },
};

export const Toolbar: Story = {
    name: 'Toolbar',
    args: {
        cacheKey: 'Toolbar',
    },
    render: ({ cacheKey }) => {
        const actionRef = useRef<ActionType>();
        console.log('cacheKey =', cacheKey);

        return (
            <SptPageContainer title="Toolbar">
                <SptTable
                    rowKey="reconciliationCode"
                    cacheKey={cacheKey}
                    columns={columns}
                    actionRef={actionRef}
                    request={async (values) => {
                        console.log('DEBUG: Request values =', values);
                        const res = await mock({
                            current: values.current,
                            pageSize: values.pageSize,
                        });
                        return {
                            success: true,
                            total: res.total,
                            data: res.data,
                        };
                    }}
                    form={{
                        isKeyPressSubmit: false,
                    }}
                />
            </SptPageContainer>
        );
    },
};




export const ToolbarRender: Story = {
    name: 'ToolbarRender',
    args: {
        cacheKey: 'ToolbarRender',
    },
    render: ({ cacheKey }) => {
        const actionRef = useRef<ActionType>();
        console.log('cacheKey =', cacheKey);

        return (
            <SptPageContainer title="Toolbar">
                <SptTable
                    rowKey="reconciliationCode"
                    cacheKey={cacheKey}
                    columns={columns}
                    actionRef={actionRef}
                    toolBarRender={() => [
                        <Button key="export-excel">导出 Excel</Button>,
                        <Button type="primary" key="confirm-button">确认</Button>
                    ]}
                    request={async (values) => {
                        console.log('DEBUG: Request values =', values);
                        const res = await mock({
                            current: values.current,
                            pageSize: values.pageSize,
                        });
                        return {
                            success: true,
                            total: res.total,
                            data: res.data,
                        };
                    }}
                    form={{
                        isKeyPressSubmit: false,
                    }}
                />
            </SptPageContainer>
        );
    },
};

export const Transform: Story = {
    name: 'Transform',
    args: {
        cacheKey: 'Transform',
    },
    render: ({ cacheKey }) => {
        const actionRef = useRef<ActionType>();
        console.log('cacheKey =', cacheKey);

        return (
            <SptPageContainer title="Toolbar">
                <SptTable
                    rowKey="reconciliationCode"
                    cacheKey={cacheKey}
                    columns={[
                        ...columns,
                        {
                            dataIndex: 'createdAtMs',
                            title: '创建时间',
                            valueType: 'dateRange',
                            hideInTable: true,
                            search: {
                                transform: tzTimestampRangeTransformer(['createdAtBeginMs', 'createdAtEndMs']),
                            },
                            formItemProps: {
                                initialValue: [tzTime().subtract(61, 'day').startOf('day'), tzTime().endOf('day')],
                            },
                        },
                        {
                            dataIndex: 'createdAtMs',
                            title: '创建时间',
                            valueType: 'dateTime',
                            sorter: true,
                            render(_, r) {
                                return tzTimeFormatter(r.createdAtMs, TIME_DAY_FORMAT);
                            },
                            search: false,
                            width: 112,
                        },
                    ]}
                    actionRef={actionRef}
                    toolBarRender={() => [
                        <Button key="export-excel">导出 Excel</Button>,
                        <Button type="primary" key="confirm-button">确认</Button>
                    ]}
                    request={async (values) => {
                        console.log('DEBUG: Request values =', values);
                        const res = await mock({
                            current: values.current,
                            pageSize: values.pageSize,
                        });
                        return {
                            success: true,
                            total: res.total,
                            data: res.data,
                        };
                    }}
                    form={{
                        isKeyPressSubmit: false,
                    }}
                />
            </SptPageContainer>
        );
    },
};


export const FormInstance: Story = {
    name: 'FormInstance',
    args: {
        cacheKey: 'FormInstance',
    },
    render: ({ cacheKey }) => {
        const actionRef = useRef<ActionType>();
        const [form] = ProForm.useForm();
        const formRef = useRef<ProFormInstance>();
        const [msg, setMsg] = useState('');

        const showMsg = (item: any) => {
            setMsg(JSON.stringify(item));
        }

        return (
            <SptPageContainer title="Toolbar">
                <div>
                    { msg }
                </div>
                <div>
                    <h2>const [form] = ProForm.useForm()</h2>
                    <Space>
                        <Button
                            onClick={() => {
                                showMsg(form.getFieldsValue());
                            }}
                        >
                                获取参数
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => {
                                form?.submit();
                            }}>
                            Submit
                        </Button>
                    </Space>
                </div>
                <div>
                <h2>formRef 使用</h2>
                    <Space>
                        <Button
                            onClick={() => {
                                showMsg(formRef.current?.getFieldsValue());
                            }}
                        >
                                获取参数
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => {
                                formRef.current?.submit();
                            }}>
                            Submit
                        </Button>
                    </Space>
                </div>
                <SptTable
                    rowKey="reconciliationCode"
                    cacheKey={cacheKey}
                    formRef={formRef}
                    search={{
                        form,
                    }}
                    columns={[
                        ...columns,
                        {
                            dataIndex: 'createdAtMs',
                            title: '创建时间',
                            valueType: 'dateRange',
                            hideInTable: true,
                            search: {
                                transform: tzTimestampRangeTransformer(['createdAtBeginMs', 'createdAtEndMs']),
                            },
                            formItemProps: {
                                initialValue: [tzTime().subtract(61, 'day').startOf('day'), tzTime().endOf('day')],
                            },
                        },
                        {
                            dataIndex: 'createdAtMs',
                            title: '创建时间',
                            valueType: 'dateTime',
                            sorter: true,
                            render(_, r) {
                                return tzTimeFormatter(r.createdAtMs, TIME_DAY_FORMAT);
                            },
                            search: false,
                            width: 112,
                        },
                    ]}
                    actionRef={actionRef}
                    toolBarRender={() => [
                        <Button key="export-excel">导出 Excel</Button>,
                        <Button type="primary" key="confirm-button">确认</Button>
                    ]}
                    request={async (values) => {
                        console.log('DEBUG: Request values =', values);
                        const res = await mock({
                            current: values.current,
                            pageSize: values.pageSize,
                        });
                        return {
                            success: true,
                            total: res.total,
                            data: res.data,
                        };
                    }}
                    form={{
                        isKeyPressSubmit: false,
                    }}
                />
            </SptPageContainer>
        );
    },
};


export const DefaultCacheKey: Story = {
    name: 'DefaultCacheKey',
    args: {},
    render: () => {
        const actionRef = useRef<ActionType>();
        const [form] = ProForm.useForm();
        const formRef = useRef<ProFormInstance>();
        const matches = useMatches();
        console.log("matches =", matches);

        return (
            <SptPageContainer title="Toolbar">
                <h2>
                    默认CacheKey测试
                </h2>
                <SptTable
                    rowKey="reconciliationCode"
                    formRef={formRef}
                    cacheKey='cache_key_test'
                    search={{
                        form,
                    }}
                    drawerTrigger={false}
                    columns={[
                        {
                            dataIndex: 'createdAtMs',
                            title: '创建时间',
                            valueType: 'dateTime',
                            sorter: true,
                            render(_, r) {
                                return tzTimeFormatter(r.createdAtMs, TIME_DAY_FORMAT);
                            },
                            search: false,
                        },
                        ...columns,
                        {
                            dataIndex: 'createdAtMs',
                            title: '创建时间',
                            valueType: 'dateRange',
                            hideInTable: true,
                            search: {
                                transform: tzTimestampRangeTransformer(['createdAtBeginMs', 'createdAtEndMs']),
                            },
                            formItemProps: {
                                initialValue: [tzTime().subtract(61, 'day').startOf('day'), tzTime().endOf('day')],
                            },
                        },
                        
                    ]}
                    actionRef={actionRef}
                    toolBarRender={() => [
                        <Button key="export-excel">导出 Excel</Button>,
                        <Button type="primary" key="confirm-button">确认</Button>
                    ]}
                    request={async (values) => {
                        console.log('DEBUG: Request values =', values);
                        const res = await mock({
                            current: values.current,
                            pageSize: values.pageSize,
                        });
                        return {
                            success: true,
                            total: res.total,
                            data: [{ reconciliationCode: '啊圣诞节啊了解到啦数据德拉吉拉达拉斯加大垃圾袋里'  }, ...res.data],
                        };
                    }}
                    form={{
                        isKeyPressSubmit: false,
                    }}
                />
            </SptPageContainer>
        );
    },
};


export const TableRender: Story = {
    name: 'TableRender',
    args: {},
    render: () => {
        const actionRef = useRef<ActionType>();
        const [form] = ProForm.useForm();
        const formRef = useRef<ProFormInstance>();
        const matches = useMatches();
        console.log("matches =", matches);

        return (
            <SptPageContainer title="TableRender">
                <h2>
                    默认CacheKey测试
                </h2>
                <SptTable
                    rowKey="reconciliationCode"
                    cacheKey='TableRender'
                    formRef={formRef}
                    search={{
                        form,
                    }}
                    drawerTrigger={false}
                    columns={[
                        {
                            dataIndex: 'createdAtMs',
                            title: '创建时间',
                            valueType: 'dateTime',
                            sorter: true,
                            render(_, r) {
                                return tzTimeFormatter(r.createdAtMs, TIME_DAY_FORMAT);
                            },
                            search: false,
                        },
                        ...columns,
                        {
                            dataIndex: 'createdAtMs',
                            title: '创建时间',
                            valueType: 'dateRange',
                            hideInTable: true,
                            search: {
                                transform: tzTimestampRangeTransformer(['createdAtBeginMs', 'createdAtEndMs']),
                            },
                            formItemProps: {
                                initialValue: [tzTime().subtract(61, 'day').startOf('day'), tzTime().endOf('day')],
                            },
                        },
                       
                    ]}
                    tableRender={() => {
                        return <div>REPLACE TABLE RENDER!!!</div>
                    }}
                    actionRef={actionRef}
                    toolBarRender={() => [
                        <Button key="export-excel">导出 Excel</Button>,
                        <Button type="primary" key="confirm-button">确认</Button>
                    ]}
                    request={async (values) => {
                        console.log('DEBUG: Request values =', values);
                        const res = await mock({
                            current: values.current,
                            pageSize: values.pageSize,
                        });
                        return {
                            success: true,
                            total: res.total,
                            data: res.data,
                        };
                    }}
                />
            </SptPageContainer>
        );
    },
};



export const SearchParams: Story = {
    name: 'SearchParams',
    args: {},
    render: () => {
        const actionRef = useRef<ActionType>();
        const [form] = ProForm.useForm();
        const formRef = useRef<ProFormInstance>();
        const matches = useMatches();
        console.log("matches =", matches);
        // const [_searchParams, setSearchParams] = useSearchParams();

        const onParamsChange = () => {
            // setSearchParams({
            //     table_search_params: JSON.stringify({
            //         params: nanoid(6),
            //     }),
            // });
        }

        return (
            <SptPageContainer title="Filter 区域默认值注入">
                <SptTable
                    rowKey="reconciliationCode"
                    cacheKey='SearchParams'
                    formRef={formRef}
                    search={{
                        form,
                    }}
                    drawerTrigger={false}
                    columns={[
                        ...columns,
                        {
                            dataIndex: 'params',
                            title: '参数',
                            order: 10000,
                        },
                        {
                            dataIndex: 'createdAtMs',
                            title: '创建时间',
                            valueType: 'dateTime',
                            sorter: true,
                            render(_, r) {
                                return tzTimeFormatter(r.createdAtMs, TIME_DAY_FORMAT);
                            },
                            search: false,
                            width: 112,
                        },
                    ]}
                    actionRef={actionRef}
                    toolBarRender={() => [
                        <Button type="primary" key="confirm-button" onClick={onParamsChange}>替换params</Button>
                    ]}
                    request={async (values) => {
                        console.log('DEBUG: Request values =', values);
                        const res = await mock({
                            current: values.current,
                            pageSize: values.pageSize,
                        });
                        return {
                            success: true,
                            total: res.total,
                            data: res.data,
                        };
                    }}
                />
            </SptPageContainer>
        );
    },
};

export const Reset: Story = {
    name: 'Reset 测试',
    args: {
        cacheKey: 'reset-table-test',
    },
    render: ({ cacheKey }) => {
        const actionRef = useRef<ActionType>();
        console.log('cacheKey =', cacheKey);

        const _columns = [
            {
                dataInex: 'no-params',
                title: '无参数',
                width: 300,
            }
        ]

        useEffect(() => {
            // 多次触发reset，测试是否会多次请求，或者不发起请求
            console.log("触发reset!!!")
            actionRef.current?.reset?.();
        }, []);

        return (
            <SptPageContainer title="月度对账单">
                <Button
                    onClick={() => {
                        actionRef.current?.reset?.();
                    }}
                >
                    重置测试
                </Button>
                <SptTable
                    rowKey="reconciliationCode"
                    cacheKey={cacheKey}
                    columns={_columns}
                    actionRef={actionRef}
                    request={async (values) => {
                        console.log('DEBUG: Request values =', values);
                        const res = await mock({
                            current: values.current,
                            pageSize: values.pageSize,
                        }, 0);
                        return {
                            success: true,
                            total: res.total,
                            data: res.data,
                        };
                    }}
                />
            </SptPageContainer>
        );
    },
};



export const Format: Story = {
    name: 'Format 参数测试',
    args: {
        cacheKey: 'format-table-story',
    },
    render: ({ cacheKey }) => {
        const actionRef = useRef<ActionType>();

        const _columns: SptProColumns<any>[] = [
            {
                dataIndex: 'no-params',
                title: '无参数',
                width: 300,
            },
            {
                dataIndex: 'dateMonth',
                title: '月份',
                valueType: 'sptDateMonth',
                width: 300,
                fieldProps: {
                    format: TIME_MONTH_FORMAT,
                },
                search: {
                    transform: (value: any) => {
                        return {start: value[0], end: value[1]}
                    }
                }
            },
            {
                dataIndex: 'dateMonth2',
                title: '月份2',
                valueType: 'sptDateMonth',
                width: 300,
                fieldProps: {
                    format: (val: any) => val.format(TIME_MONTH_FORMAT),
                },
                search: {
                    transform: (value: any) => {
                        return {start: value[0], end: value[1]}
                    }
                }
            }
        ]

        useEffect(() => {
            // 多次触发reset，测试是否会多次请求，或者不发起请求
            console.log("触发reset!!!")
            actionRef.current?.reset?.();
        }, []);

        return (
            <SptPageContainer title="月度对账单">
                <Button
                    onClick={() => {
                        actionRef.current?.reset?.();
                    }}
                >
                    重置测试
                </Button>
                <SptTable
                    rowKey="reconciliationCode"
                    cacheKey={cacheKey}
                    columns={_columns}
                    actionRef={actionRef}
                    request={async (values) => {
                        console.log('DEBUG: Request values =', values);
                        const res = await mock({
                            current: values.current,
                            pageSize: values.pageSize,
                        }, 0);
                        return {
                            success: true,
                            total: res.total,
                            data: res.data,
                        };
                    }}
                />
            </SptPageContainer>
        );
    },
};


export const DataSourcePagination: Story = {
    name: '使用 DataSource 无分页',
    args: {
        cacheKey: 'spt-table-datasource-pagination',
    },
    render: ({ cacheKey }) => {
        const actionRef = useRef<ActionType>();
        const [dataSource, setDataSource] = useState<any[] | undefined>([]);

        const queryData = async () => {
            const res = await mock({
                current: 1,
                pageSize: 100,
            });

            setDataSource(res?.data);
        }

        useMount(() => {
            queryData();
        })
        const count = useRef(0);
        console.log("执行次数", count.current++)

        return (
            <SptPageContainer title="DataSource 数据测试">
                <SptTable
                    cacheKey={cacheKey}
                    columns={columns}
                    actionRef={actionRef}
                    dataSource={dataSource}
                    onSubmit={(values) => {
                        console.log("Values =", values);
                    }}
                    pagination={false}
                />
            </SptPageContainer>
        );
    },
}



export const PageSize: Story = {
    name: 'PageSize',
    args: {
        cacheKey: 'fixed_table_page_size',
    },
    render: ({ cacheKey }) => {
        const actionRef = useRef<ActionType>();
        const formRef = useRef<ProFormInstance>();

        return (
            <SptPageContainer title="PageSize">
                <Button
                    onClick={() => {
                        actionRef.current?.reset?.();
                    }}
                >
                    重置测试
                </Button>
                <SptTable
                    rowKey="reconciliationCode"
                    cacheKey={cacheKey}
                    columns={columns}
                    actionRef={actionRef}
                    formRef={formRef}
                    pagination={{
                        defaultPageSize: 10,
                    }}
                    request={async (values) => {
                        console.log("Query =", values);
                        const res = await mock({
                            current: values.current,
                            pageSize: 1000,
                        }, 0);

                        return {
                            success: true,
                            total: 1000,
                            data: res.data,
                        };
                    }}
                />
            </SptPageContainer>
        );
    },
};


export const DisableDrawerTrigger: Story = {
    name: '禁用抽屉触发',
    args: {
        cacheKey: 'disable_drawer_trigger',
    },
    render: ({ cacheKey }) => {
        const actionRef = useRef<ActionType>();
        const formRef = useRef<ProFormInstance>();

        return (
            <SptPageContainer title="禁用抽屉触发">
                <SptTable
                    rowKey="reconciliationCode"
                    cacheKey={cacheKey}
                    columns={columns}
                    actionRef={actionRef}
                    formRef={formRef}
                    drawerTrigger={false} // 禁用整个表格的抽屉触发
                    request={async (values) => {
                        const res = await mock({
                            current: values.current,
                            pageSize: values.pageSize,
                        }, 0);
                        return {
                            success: true,
                            total: res.total,
                            data: res.data,
                        };
                    }}
                    onRowDrawerChange={(open, record) => {
                        console.log('抽屉触发已禁用,此回调不会执行', open, record);
                    }}
                />
            </SptPageContainer>
        );
    },
};

export const TableInModal: Story = {
    name: '在Modal中不带分页的表格',
    args: {
        cacheKey: 'table_in_modal',
    },
    render: () => {
        const [isModalOpen, setIsModalOpen] = useState(false);

        return (
            <SptPageContainer title="在Modal中不带分页的表格">
                <Button type="primary" onClick={() => setIsModalOpen(true)}>
                    打开弹窗
                </Button>
                <SptModal 
                    title="表格弹窗" 
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    width={1000}
                    footer={null}
                >
                    <SptTable
                        rowKey="reconciliationCode"
                        columns={columns}
                        pagination={false}
                        search={false}
                        request={async () => {
                            const res = await mock({
                                current: 1,
                                pageSize: 100,
                            }, 0);
                            return {
                                success: true,
                                total: res.total,
                                data: res.data
                            };
                        }}
                    />
                </SptModal>
            </SptPageContainer>
        );
    },
};


export const ChangeColumnTitle: Story = {
    name: '动态修改列标题',
    args: {
        cacheKey: 'change_column_title',
    },
    render: () => {
        const [columns, setColumns] = useState<SptProColumns<any>[]>([
            {
                dataIndex: 'reconciliationCode',
                title: '款项编号',
                width: 120,
                fixed: 'left'
            },
            {
                dataIndex: 'status',
                title: '状态',
                width: 120
            }
        ]);

        return (
            <SptPageContainer title="动态修改列标题">
                <Space style={{ marginBottom: 16 }}>
                    <Button
                        onClick={() => {
                            setColumns(prev => prev.map(col => {
                                if (col.dataIndex === 'status') {
                                    return {
                                        ...col,
                                        title: '当前状态'
                                    };
                                }
                                return col;
                            }));
                        }}
                    >
                        修改状态列标题
                    </Button>
                    <Button
                        onClick={() => {
                            setColumns(prev => prev.map(col => {
                                if (col.dataIndex === 'status') {
                                    return {
                                        ...col,
                                        title: '状态'
                                    };
                                }
                                return col;
                            }));
                        }}
                    >
                        重置状态列标题
                    </Button>
                </Space>

                <SptTable
                    rowKey="reconciliationCode"
                    columns={columns}
                    search={false}
                    request={async () => {
                        const res = await mock({
                            current: 1,
                            pageSize: 10,
                        }, 0);
                        return {
                            success: true,
                            total: res.total,
                            data: res.data
                        };
                    }}
                />
            </SptPageContainer>
        );
    },
};
