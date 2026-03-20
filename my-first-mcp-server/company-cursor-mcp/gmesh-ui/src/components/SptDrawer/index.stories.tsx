/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Meta, StoryObj } from '@storybook/react';
import SptDrawer, { useDrawerOpen } from '.';
import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { userEvent, within } from '@storybook/testing-library';
import SptTable, { SptProColumns } from '../SptTable';
import SptSearchSelect from '../SptSearchSelect';
import { tzTimestampRangeTransformer } from '@spotter/app-client-toolkit';
import SptTabs from '../SptTabs';

const meta = {
    title: 'Components/反馈/Drawer',
    component: SptDrawer,
    tags: ['autodocs']
} satisfies Meta<typeof SptDrawer>;

export default meta;

type Story = StoryObj<typeof SptDrawer>;

export const Default: Story = {
    args: {
        title: '测试抽屉页面',
        subTitle: '子标题测试'
    },
    render: ({ onClose: _close, ...args }) => {
        const [open, setOpen] = useState(false);
        const onClose = () => {
            setOpen(false);
        };
        return (
            <div>
                <Button onClick={() => setOpen(true)}>打开</Button>
                <SptDrawer open={open} onClose={onClose} {...args}>
                    Hello world
                </SptDrawer>
            </div>
        );
    }
};

export const Action: Story = {
    args: {
        title: '测试Action',
        subTitle: '子标题测试'
    },
    render: ({ onClose: _close, ...args }) => {
        const [open, setOpen] = useState(false);
        const onClose = () => {
            setOpen(false);
        };
        return (
            <div>
                <Button onClick={() => setOpen(true)}>打开</Button>
                <SptDrawer
                    open={open}
                    onClose={onClose}
                    action={
                        <Space>
                            <Button>取消</Button>
                            <Button>确定</Button>
                        </Space>
                    }
                    {...args}
                >
                    Hello world
                </SptDrawer>
            </div>
        );
    }
};

export const ClassName: Story = {
    args: {
        title: '测试Action',
        subTitle: '子标题测试',
        className: 'test-123',
        rootClassName: 'test-2333'
    },
    render: ({ onClose: _close, ...args }) => {
        const [open, setOpen] = useState(false);
        const onClose = () => {
            setOpen(false);
        };
        return (
            <div>
                <Button data-testid="openDialog" onClick={() => setOpen(true)}>
                    打开
                </Button>
                <SptDrawer
                    open={open}
                    onClose={onClose}
                    action={
                        <Space>
                            <Button>取消</Button>
                            <Button>确定</Button>
                        </Space>
                    }
                    {...args}
                >
                    Hello world
                </SptDrawer>
            </div>
        );
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const openButton = await canvas.getByTestId('openDialog');
        await userEvent.click(openButton);
    }
};

export const DrawerHook: Story = {
    args: {
        title: '测试useDrawerOpen'
    },
    render: ({ onClose: _close, ...args }) => {
        const { open, payload, updateDrawer } = useDrawerOpen<{
            taskIds: number[];
        }>();
        const onClose = () => {
            updateDrawer(false);
        };

        return (
            <div>
                <Button
                    data-testid="openDialog"
                    onClick={() => {
                        updateDrawer(true, {
                            taskIds: [1, 2, 3, 4]
                        });
                    }}
                >
                    打开
                </Button>
                <SptDrawer
                    open={open}
                    onClose={onClose}
                    action={
                        <Space>
                            <Button>取消</Button>
                            <Button>确定</Button>
                        </Space>
                    }
                    {...payload}
                    {...args}
                >
                    Hello world
                </SptDrawer>
            </div>
        );
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);

        const openButton = await canvas.getByTestId('openDialog');
        await userEvent.click(openButton);
    }
};

export const PersistDrawer: Story = {
    args: {
        title: '持久化抽屉示例',
        subTitle: '刷新页面后抽屉状态会保持'
    },
    render: ({ onClose: _close, ...args }) => {
        const { open, payload, updateDrawer } = useDrawerOpen({
            persist: true,
            payload: {
                initialData: '这是初始数据'
            }
        });
        
        const onClose = () => {
            updateDrawer(false);
        };

        return (
            <div>
                <Button onClick={() => updateDrawer(true, { initialData: '新数据' })}>
                    打开持久化抽屉
                </Button>
                <SptDrawer
                    open={open}
                    onClose={onClose}
                    {...args}
                >
                    <div>
                        <p>payload数据: {JSON.stringify(payload)}</p>
                        <p>刷新页面后抽屉会保持打开状态</p>
                    </div>
                </SptDrawer>
            </div>
        );
    }
};

export const CustomWhiteList: Story = {
    args: {
        title: '自定义白名单示例',
        whiteList: ['.custom-whitelist']
    },
    render: ({ onClose: _close, ...args }) => {
        const [open, setOpen] = useState(false);
        const onClose = () => setOpen(false);

        return (
            <div>
                <Space>
                    <Button onClick={() => setOpen(true)}>打开抽屉</Button>
                    <div className="custom-whitelist" style={{ padding: 12, border: '1px solid #ccc' }}>
                        点击这里不会关闭抽屉
                    </div>
                </Space>
                <SptDrawer open={open} onClose={onClose} {...args}>
                    点击抽屉外的区域会关闭抽屉，除非点击在白名单元素上
                </SptDrawer>
            </div>
        );
    }
};

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
    },
    {
        dataIndex: 'reconciliationType',
        title: '款项类型',
        width: 200,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        fieldProps: (form, config) => {
            // console.log("Form =", form);
            // console.log("config =", config);
            // console.log("测试fieldProps使用...");
            return {
                placeholder: '请输入款项类型, test fieldProps with function',
            };
        },
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
        dataIndex: 'companyCode',
        title: '公司',
        formItemProps: {
            name: 'companyId',
        },
        valueType: 'company',
    },
    {
        dataIndex: 'vendorCode',
        title: 'Vendor Code',
        valueType: 'vendorCode',
    },
    {
        dataIndex: 'formRenderItem',
        title: 'renderFormItem 测试',
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
        title: '级联选择器',
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

const mock = async ({ pageSize, current }: any) => {
    await sleep(200);
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


export const DrawerTable: Story = {
    args: {
        title: '带Table的抽屉',
    },
    render: ({ onClose: _close, ...args }) => {
        const [open, setOpen] = useState(false);
        const onClose = () => {
            setOpen(false);
        };
        return (
            <div>
                <Button onClick={() => setOpen(true)}>打开</Button>
                <SptDrawer open={open} onClose={onClose} {...args}>
                    <SptTable
                        rowKey="reconciliationCode"
                        cacheKey="unconfirmed_warehouse_offer"
                        columns={columns}
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
                </SptDrawer>
            </div>
        );
    }
};

export const DrawerFooter: Story = {
    args: {
        title: 'DrawerFooter',
    },
    render: ({ onClose: _close, ...args }) => {
        const [open, setOpen] = useState(false);
        const onClose = () => {
            setOpen(false);
        };
        return (
            <div>
                <Space>
                    <Button onClick={() => setOpen(true)}>打开</Button>
                    <div onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                    }}>冒泡测试</div>
                </Space>
                <SptTabs items={[{
                    label: '测试Tab1',
                    key: 'spt',
                }, {
                    label: '测试Tab2',
                    key: 'spt2',
                    count: 12,
                }, {
                    label: '测试Tab3',
                    key: 'spt3',
                    count: 100,
                }]} />
                <SptDrawer
                    open={open}
                    onClose={onClose}
                    getContainer={false}
                    footer={
                        <div style={{ width: '100%', height: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                <Space>
                                    <Button>测试</Button>
                                    <Button type="primary">提交</Button>
                                </Space>
                            </div>
                        </div>
                    }
                    {...args}
                >
                    <SptTable
                        rowKey="reconciliationCode"
                        cacheKey="unconfirmed_warehouse_offer"
                        columns={columns}
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
                </SptDrawer>
            </div>
        );
    }
};

export const ScrollBar: Story = {
    args: {
        title: '抽屉ScrollBar',
        subTitle: '抽屉ScrollBar'
    },
    render: ({ onClose: _close, ...args }) => {
        const [open, setOpen] = useState(false);
        const onClose = () => setOpen(false);

        return (
            <div>
                <Button onClick={() => setOpen(true)}>打开带标签页的抽屉</Button>
                <SptDrawer 
                    open={open}
                    onClose={onClose}
                    {...args}
                >
                    <div style={{ height: 2000, background: '#f0f0f0' }}>
                        <p>这是抽屉的内容</p>
                    </div>
                </SptDrawer>
            </div>
        );
    }
};

export const DrawerWithTabs: Story = {
    args: {
        title: '带标签页的抽屉',
        subTitle: '这是一个带标签页的抽屉示例'
    },
    render: ({ onClose: _close, ...args }) => {
        const [open, setOpen] = useState(false);
        const onClose = () => setOpen(false);

        return (
            <div>
                <Button onClick={() => setOpen(true)}>打开带标签页的抽屉</Button>
                <SptDrawer 
                    open={open}
                    onClose={onClose}
                    activeTabKey='basic'
                    tabs={[
                        {
                            label: '基本信息',
                            key: 'basic',
                            children: (
                                <div style={{ padding: '16px 0' }}>
                                    <p>这是基本信息标签页的内容</p>
                                    <p>可以在这里放置表单或其他内容</p>
                                </div>
                            )
                        },
                        {
                            label: '详细信息',
                            key: 'detail',
                            children: (
                                <div style={{ padding: '16px 0' }}>
                                    <p>这是详细信息标签页的内容</p>
                                    <p>可以在这里放置更多详细信息</p>
                                </div>
                            )
                        }
                    ]}
                    {...args}
                />
            </div>
        );
    }
};

