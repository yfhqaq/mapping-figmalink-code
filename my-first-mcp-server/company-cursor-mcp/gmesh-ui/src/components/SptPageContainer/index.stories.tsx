import { Meta, StoryObj } from '@storybook/react';
import SptPageContainer from '.';
import React from 'react';
import { withProxy } from '@/decorators/withGmesh';
import { Button, Space } from 'antd';
import SptTable, { SptTableColumn } from '../SptTable';
import { TIME_MONTH_FORMAT, tzTimeFormatter, tzTimestampRangeTransformer } from '@spotter/app-client-toolkit';
import dataSource from './__test__/datasource.json';

const meta = {
    title: 'Components/布局/PageContainer',
    component: SptPageContainer,
    decorators: [withProxy],
    tags: ['autodocs'],
} satisfies Meta<typeof SptPageContainer>;

export default meta;

type Story = StoryObj<typeof SptPageContainer>;

export const Page: Story = {
    args: {
        title: '测试页面标题',
        subTitle: '测试页面子标题'
    },
    render: ({ ...args }) => {
        return (
            <SptPageContainer title="测试页面" {...args}>
                这是一个列表页面的展示
            </SptPageContainer>
        );
    }
};

export const Footer: Story = {
    args: {
        ...Page.args
    },
    render: ({ ...args }) => {
        const columns: SptTableColumn<any>[] = [
            {
                dataIndex: 'reconciliationCode',
                title: '款项编号',
                width: 200
            },
            {
                dataIndex: 'companyCode',
                title: '公司',
                width: 200
            },
            {
                dataIndex: 'reconciliationDate',
                title: '款项生成月份',
                valueType: 'dateRange',
                fieldProps: {
                    picker: 'month',
                    format: (val: any) => val.format(TIME_MONTH_FORMAT)
                },
                search: {
                    transform: tzTimestampRangeTransformer(
                        ['reconciliationStartDate', 'reconciliationEndDate'],
                        'month'
                    )
                },
                render: (_, r) => tzTimeFormatter(r.reconciliationDate, TIME_MONTH_FORMAT),
                width: 200
            },
            {
                dataIndex: 'reconciliationAmount',
                align: 'right',
                title: '款项金额',
                width: 200,
                search: false
            },
            {
                dataIndex: 'createdName',
                title: '创建人',
                valueType: 'select',
                fieldProps: {
                    name: 'createdId'
                },
                width: 200
            },
            {
                dataIndex: 'createdAt',
                title: '创建时间',
                width: 220,
                search: false
            }
        ];

        return (
            <div style={{ background: '#f7f9fb', padding: 24 }}>
                <SptPageContainer
                    title="测试页面"
                    footerToolbar={
                        <Space>
                            <Button>取消</Button>
                            <Button type="primary">确认</Button>
                        </Space>
                    }
                    {...args}
                >
                    <SptTable pagination={false} columns={columns} dataSource={dataSource} />
                </SptPageContainer>
            </div>
        );
    }
};

export const TabNavigation: Story = {
    name: '禁用Navigation模式',
    args: {
        ...Page.args,
        tabNavigationMode: false,
        tabs: [
            {
                tab: '测试1',
                tabKey: '1',
                count: 88,
            },
            {
                tab: '测试2',
                tabKey: '2'
            }
        ],
    },
    render: ({ ...args }) => {
        const columns: SptTableColumn<any>[] = [
            {
                dataIndex: 'reconciliationCode',
                title: '款项编号',
                width: 200
            },
            {
                dataIndex: 'companyCode',
                title: '公司',
                width: 200
            },
            {
                dataIndex: 'reconciliationDate',
                title: '款项生成月份',
                valueType: 'dateRange',
                fieldProps: {
                    picker: 'month',
                    format: (val: any) => val.format(TIME_MONTH_FORMAT)
                },
                search: {
                    transform: tzTimestampRangeTransformer(
                        ['reconciliationStartDate', 'reconciliationEndDate'],
                        'month'
                    )
                },
                render: (_, r) => tzTimeFormatter(r.reconciliationDate, TIME_MONTH_FORMAT),
                width: 200
            },
            {
                dataIndex: 'reconciliationAmount',
                align: 'right',
                title: '款项金额',
                width: 200,
                search: false
            },
            {
                dataIndex: 'createdName',
                title: '创建人',
                valueType: 'select',
                fieldProps: {
                    name: 'createdId'
                },
                width: 200
            },
            {
                dataIndex: 'createdAt',
                title: '创建时间',
                width: 220,
                search: false
            }
        ];

        return (
            <SptPageContainer
                title="测试页面"
                footerToolbar={
                    <Space>
                        <Button>取消</Button>
                        <Button type="primary">确认</Button>
                    </Space>
                }
                {...args}
            >
                <SptTable pagination={false} columns={columns} dataSource={dataSource} />
            </SptPageContainer>
        );
    }
};

export const Navigation: Story = {
    name: 'Navigation模式',
    args: {
        ...Page.args,
        tabs: [
            {
                tab: '确认仓库',
                tabKey: '1',
                count: 120,
            },
            {
                tab: '测试2',
                tabKey: '2',
                count: 10,
            },
            {
                tab: '测试3',
                tabKey: '3',
                count: 5,
            }
        ],
    },
    render: ({ ...args }) => {
        const columns: SptTableColumn<any>[] = [
            {
                dataIndex: 'reconciliationCode',
                title: '款项编号',
                width: 200
            },
            {
                dataIndex: 'companyCode',
                title: '公司',
                width: 200
            },
            {
                dataIndex: 'reconciliationDate',
                title: '款项生成月份',
                valueType: 'dateRange',
                fieldProps: {
                    picker: 'month',
                    format: (val: any) => val.format(TIME_MONTH_FORMAT)
                },
                search: {
                    transform: tzTimestampRangeTransformer(
                        ['reconciliationStartDate', 'reconciliationEndDate'],
                        'month'
                    )
                },
                render: (_, r) => tzTimeFormatter(r.reconciliationDate, TIME_MONTH_FORMAT),
                width: 200
            },
            {
                dataIndex: 'reconciliationAmount',
                align: 'right',
                title: '款项金额',
                width: 200,
                search: false
            },
            {
                dataIndex: 'createdName',
                title: '创建人',
                valueType: 'select',
                fieldProps: {
                    name: 'createdId'
                },
                width: 200
            },
            {
                dataIndex: 'createdAt',
                title: '创建时间',
                width: 220,
                search: false
            }
        ];

        return (
            <SptPageContainer
                title="测试页面"
                footerToolbar={
                    <Space>
                        <Button>取消</Button>
                        <Button type="primary">确认</Button>
                    </Space>
                }
                {...args}
            >
                <SptTable pagination={false} columns={columns} dataSource={dataSource} />
            </SptPageContainer>
        );
    }
};

export const Tabs: Story = {
    name: 'Tabs 模式',
    args: {
        tabs: [
            {
                tab: '确认仓库',
                tabKey: '1',
                count: 120,
            },
            {
                tab: '测试2',
                tabKey: '2',
                count: 10,
            },
            {
                tab: '测试3',
                tabKey: '3',
                count: 5,
            }
        ],
    },
    render: ({ ...args }) => {
        const columns: SptTableColumn<any>[] = [
            {
                dataIndex: 'reconciliationCode',
                title: '款项编号',
                width: 200
            },
            {
                dataIndex: 'companyCode',
                title: '公司',
                width: 200
            },
            {
                dataIndex: 'reconciliationDate',
                title: '款项生成月份',
                valueType: 'dateRange',
                fieldProps: {
                    picker: 'month',
                    format: (val: any) => val.format(TIME_MONTH_FORMAT)
                },
                search: {
                    transform: tzTimestampRangeTransformer(
                        ['reconciliationStartDate', 'reconciliationEndDate'],
                        'month'
                    )
                },
                render: (_, r) => tzTimeFormatter(r.reconciliationDate, TIME_MONTH_FORMAT),
                width: 200
            },
            {
                dataIndex: 'reconciliationAmount',
                align: 'right',
                title: '款项金额',
                width: 200,
                search: false
            },
            {
                dataIndex: 'createdName',
                title: '创建人',
                valueType: 'select',
                fieldProps: {
                    name: 'createdId'
                },
                width: 200
            },
            {
                dataIndex: 'createdAt',
                title: '创建时间',
                width: 220,
                search: false
            }
        ];

        return (
            <SptPageContainer
                {...args}
            >
                <SptTable pagination={false} columns={columns} dataSource={dataSource} />
            </SptPageContainer>
        );
    }
};

export const tableAction: Story = {
    name: 'tableAction',
    args: {
        tabs: [
            {
                tab: '确认仓库',
                tabKey: '1',
            },
            {
                tab: '测试2',
                tabKey: '2',
            },
            {
                tab: '测试3',
                tabKey: '3',
            }
        ],
    },
    render: ({ ...args }) => {
        const columns: SptTableColumn<any>[] = [
            {
                dataIndex: 'reconciliationCode',
                title: '款项编号',
                width: 200
            },
            {
                dataIndex: 'companyCode',
                title: '公司',
                width: 200
            },
            {
                dataIndex: 'reconciliationDate',
                title: '款项生成月份',
                valueType: 'dateRange',
                fieldProps: {
                    picker: 'month',
                    format: (val: any) => val.format(TIME_MONTH_FORMAT)
                },
                search: {
                    transform: tzTimestampRangeTransformer(
                        ['reconciliationStartDate', 'reconciliationEndDate'],
                        'month'
                    )
                },
                render: (_, r) => tzTimeFormatter(r.reconciliationDate, TIME_MONTH_FORMAT),
                width: 200
            },
            {
                dataIndex: 'reconciliationAmount',
                align: 'right',
                title: '款项金额',
                width: 200,
                search: false
            },
            {
                dataIndex: 'createdName',
                title: '创建人',
                valueType: 'select',
                fieldProps: {
                    name: 'createdId'
                },
                width: 200
            },
            {
                dataIndex: 'createdAt',
                title: '创建时间',
                width: 220,
                search: false
            }
        ];

        return (
            <SptPageContainer
                tableAction={[
                    <Button key="new-add">全局区域的新增操作</Button>,
                    <Button key="new-add" type="primary">新增</Button>
                ]}
                {...args}
            >
                <SptTable
                    inheritAction
                    pagination={false}
                    columns={columns}
                    dataSource={dataSource}
                />
            </SptPageContainer>
        );
    }
};


export const TableRender: Story = {
    name: 'TableRender',
    args: {
        tabs: [
            {
                tab: '确认仓库',
                tabKey: '1',
            },
            {
                tab: '测试2',
                tabKey: '2',
            },
            {
                tab: '测试3',
                tabKey: '3',
            }
        ],
    },
    render: ({ ...args }) => {
        const columns: SptTableColumn<any>[] = [
            {
                dataIndex: 'reconciliationCode',
                title: '款项编号',
                width: 200
            },
            {
                dataIndex: 'companyCode',
                title: '公司',
                width: 200
            },
            {
                dataIndex: 'reconciliationDate',
                title: '款项生成月份',
                valueType: 'dateRange',
                fieldProps: {
                    picker: 'month',
                    format: (val: any) => val.format(TIME_MONTH_FORMAT)
                },
                search: {
                    transform: tzTimestampRangeTransformer(
                        ['reconciliationStartDate', 'reconciliationEndDate'],
                        'month'
                    )
                },
                render: (_, r) => tzTimeFormatter(r.reconciliationDate, TIME_MONTH_FORMAT),
                width: 200
            },
            {
                dataIndex: 'reconciliationAmount',
                align: 'right',
                title: '款项金额',
                width: 200,
                search: false
            },
            {
                dataIndex: 'createdName',
                title: '创建人',
                valueType: 'select',
                fieldProps: {
                    name: 'createdId'
                },
                width: 200
            },
            {
                dataIndex: 'createdAt',
                title: '创建时间',
                width: 220,
                search: false
            }
        ];

        return (
            <SptPageContainer
                tableAction={[
                    <Button key="new-add">全局区域的新增操作</Button>,
                    <Button key="new-add" type="primary">新增</Button>
                ]}
                {...args}
            >
                <SptTable
                    inheritAction
                    toolBarRender={() => [
                        <Button key="export excel">导出 Excel</Button>
                    ]}
                    pagination={false}
                    columns={columns}
                    dataSource={dataSource}
                />
            </SptPageContainer>
        );
    }
};

export const SubTitle: Story = {
    name: '仅包含SubTitle',
    args: {
        tabs: [
            {
                tab: '确认仓库',
                tabKey: '1',
                count: 120,
            },
            {
                tab: '测试2',
                tabKey: '2',
                count: 10,
            },
            {
                tab: '测试3',
                tabKey: '3',
                count: 5,
            }
        ],
    },
    render: ({ ...args }) => {
        const columns: SptTableColumn<any>[] = [
            {
                dataIndex: 'reconciliationCode',
                title: '款项编号',
                width: 200
            },
            {
                dataIndex: 'companyCode',
                title: '公司',
                width: 200
            },
            {
                dataIndex: 'reconciliationDate',
                title: '款项生成月份',
                valueType: 'dateRange',
                fieldProps: {
                    picker: 'month',
                    format: (val: any) => val.format(TIME_MONTH_FORMAT)
                },
                search: {
                    transform: tzTimestampRangeTransformer(
                        ['reconciliationStartDate', 'reconciliationEndDate'],
                        'month'
                    )
                },
                render: (_, r) => tzTimeFormatter(r.reconciliationDate, TIME_MONTH_FORMAT),
                width: 200
            },
            {
                dataIndex: 'reconciliationAmount',
                align: 'right',
                title: '款项金额',
                width: 200,
                search: false
            },
            {
                dataIndex: 'createdName',
                title: '创建人',
                valueType: 'select',
                fieldProps: {
                    name: 'createdId'
                },
                width: 200
            },
            {
                dataIndex: 'createdAt',
                title: '创建时间',
                width: 220,
                search: false
            }
        ];

        return (
            <SptPageContainer
                subTitle="真是一个非常棒的、有用的、可靠的啊吧吧吧"
                footerToolbar={
                    <Space>
                        <Button>取消</Button>
                        <Button type="primary">确认</Button>
                    </Space>
                }
                {...args}
            >
                <SptTable pagination={false} columns={columns} dataSource={dataSource} />
            </SptPageContainer>
        );
    }
};


export const LongTitle: Story = {
    args: {
        title: '这是一个非常长的标题用来测试页面容器组件的标题展示效果这是一个非常长的标题用来测试页面容器组件的标题展示效果这是一个非常长的标题用来测试页面容器组件的标题展示效果这是一个非常长的标题用来测试页面容器组件的标题展示效果这是一个非常长的标题用来测试页面容器组件的标题展示效果这是一个非常长的标题用来测试页面容器组件的标题展示效果这是一个非常长的标题用来测试页面容器组件的标题展示效果这是一个非常长的标题用来测试页面容器组件的标题展示效果这是一个非常长的标题用来测试页面容器组件的标题展示效果这是一个非常长的标题用来测试页面容器组件的标题展示效果这是一个非常长的标题用来测试页面容器组件的标题展示效果这是一个非常长的标题用来测试页面容器组件的标题展示效果',
        subTitle: '这是一个副标题',
        showTitleEllipsis: true,
        titleEllipsisRows: 1
    },
    render: ({ ...args }) => {
        return (
            <SptPageContainer {...args}>
                这是一个带有超长标题的页面容器示例
            </SptPageContainer>
        );
    }
};


export const WithAction: Story = {
    args: {
        title: '带有操作区域的页面',
        subTitle: '这是一个副标题'
    },
    render: ({ ...args }) => {
        return (
            <SptPageContainer
                {...args}
                action={
                    <Space>
                        <Button>取消</Button>
                        <Button type="primary">提交</Button>
                    </Space>
                }
            >
                这是一个带有操作区域的页面容器示例
            </SptPageContainer>
        );
    }
};

// export const FitContainer: Story = {
//     name: '适配容器',
//     args: {
//         title: '适配容器的页面',
//         subTitle: '这是一个副标题',
//         fitContainer: true
//     },
//     render: ({ ...args }) => {
//         return (
//             <SptPageContainer {...args}>
//                 <div style={{ height: '100%', background: '#fff', padding: 24 }}>
//                     这是一个适配容器高度的页面示例
//                 </div>
//             </SptPageContainer>
//         );
//     }
// };
