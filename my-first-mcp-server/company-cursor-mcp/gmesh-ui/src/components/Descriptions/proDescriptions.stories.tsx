import type { Meta, StoryObj } from '@storybook/react';
import { ProDescriptions, SptProDescriptionsColumn } from './proDescriptions';
import React from 'react';

const meta: Meta<typeof ProDescriptions> = {
    title: 'Components/反馈/ProDescriptions',
    component: ProDescriptions,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProDescriptions>;

interface DataType {
    username: string;
    phone: string;
    address: string;
    email: string;
}

const dataSource: DataType = {
    username: '周杰伦',
    phone: '1234567890',
    address: '杭州市西湖区',
    email: 'jay@example.com'
};

export const Default: Story = {
    args: {
        title: '用户信息',
        columns: [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '手机号',
                dataIndex: 'phone'
            },
            {
                title: '地址',
                dataIndex: 'address'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            }
        ],
        dataSource: dataSource
    }
};

export const WithCustomRender: Story = {
    args: {
        title: '用户信息(自定义渲染)',
        columns: [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '手机号',
                dataIndex: 'phone',
                render: (value) => <a href={`tel:${value}`}>{value}</a>
            },
            {
                title: '地址',
                dataIndex: 'address',
                span: 2
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                render: (value) => <a href={`mailto:${value}`}>{value}</a>
            }
        ],
        dataSource: dataSource,
        bordered: true
    }
};
export const WithValueEnum: Story = {
    args: {
        title: '状态标记展示',
        columns: [
            {
                title: '默认状态',
                dataIndex: 'default',
                valueEnum: {
                    'default': {
                        text: '默认状态',
                        status: 'default'
                    }
                }
            },
            {
                title: '成功状态',
                dataIndex: 'success',
                valueEnum: {
                    'success': {
                        text: '成功状态',
                        status: 'success'
                    }
                }
            },
            {
                title: '错误状态',
                dataIndex: 'error',
                valueEnum: {
                    'error': {
                        text: '错误状态',
                        status: 'error'
                    }
                }
            },
            {
                title: '处理中状态',
                dataIndex: 'processing',
                valueEnum: {
                    'processing': {
                        text: '处理中状态',
                        status: 'processing'
                    }
                }
            },
            {
                title: '警告状态',
                dataIndex: 'warning',
                valueEnum: {
                    'warning': {
                        text: '警告状态',
                        status: 'warning'
                    }
                }
            }
        ],
        dataSource: {
            default: 'default',
            success: 'success',
            error: 'error',
            processing: 'processing',
            warning: 'warning'
        },
        bordered: true
    }
};

/**
 * 带有提示信息的描述列表
 */
export const WithTooltip: Story = {
    args: {
        title: '带有提示的描述列表',
        columns: [
            {
                title: '用户名',
                dataIndex: 'username',
                tooltip: '用户的登录名称'
            },
            {
                title: '手机号',
                dataIndex: 'phone',
                tooltip: {
                    title: '用户的联系电话',
                    placement: 'right'
                }
            },
            {
                title: '注册时间',
                dataIndex: 'registerTime',
                tooltip: '用户首次注册的时间'
            },
            {
                title: '账户状态',
                dataIndex: 'status',
                tooltip: '当前账户的状态信息',
                valueEnum: {
                    'active': {
                        text: '活跃',
                        status: 'success'
                    },
                    'inactive': {
                        text: '非活跃',
                        status: 'default'
                    },
                    'suspended': {
                        text: '已暂停',
                        status: 'warning'
                    }
                }
            }
        ],
        dataSource: {
            username: 'zhangsan',
            phone: '13800138000',
            registerTime: '2023-01-15 08:30:00',
            status: 'active'
        },
        bordered: true
    }
};


export const Demo:Story = {
    render:()=>{
        const dataSource = {
            username: '周杰伦',
            phone: '1234567890',
            address: '杭州市西湖区',
            email: 'jay@example.com'
        };

        const columns: SptProDescriptionsColumn<typeof dataSource>[] = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            
        ]
        
        return <div>
            <ProDescriptions title="用户信息" columns={columns} dataSource={dataSource} />
        </div>
    }
}

export const WithoutTitle: Story = {
    render: () => {
        const dataSource = {
            username: '林俊杰',
            phone: '13900139000',
            address: '上海市黄浦区',
            email: 'jj@example.com'
        };

        const columns: SptProDescriptionsColumn<typeof dataSource>[] = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '手机号',
                dataIndex: 'phone'
            },
            {
                title: '地址',
                dataIndex: 'address'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            }
        ];
        
        return <div>
            <ProDescriptions columns={columns} dataSource={dataSource} />
        </div>
    }
};
