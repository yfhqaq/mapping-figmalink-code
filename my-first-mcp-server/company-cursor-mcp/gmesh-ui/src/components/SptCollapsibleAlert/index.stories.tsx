import type { Meta, StoryObj } from '@storybook/react';
import SptCollapsibleAlert from '.';
import React from 'react';
import { Typography } from 'antd';

//👇 This default export determines where your story goes in the story list
const meta = {
    title: 'Components/反馈/SptCollapsibleAlert',
    component: SptCollapsibleAlert,
    tags: ['autodocs']
} satisfies Meta<typeof SptCollapsibleAlert>;

export default meta;

type Story = StoryObj<typeof SptCollapsibleAlert>;

export const Default: Story = {
    args: {
        showIcon: true,
        rows: 1,
        type: 'warning',
        description: <b>以下供应商付款渠道是银行，收款渠道是 PingPong，请及时处理</b>,
    },
    render: ({ onClose: _close, ...args }) => {
        const noPingpongRelationList = [
            {
                "companyName": "千岸",
                "companyCode": "CNSZQA",
                "companyId": 9,
                "companyAddr": null,
                "companyEnglishName": "QIANAN COMPANY NAME.",
                "companyChineseName": "千岸公司全称",
                "bankName": "Pingpong",
                "companyStatus": 1,
                "updatedId": "1",
                "updatedName": "admin",
                "updatedAt": "2023-11-30T11:02:55"
            },
            {
                "companyName": "瑞康诺",
                "companyCode": "CNSZRN",
                "companyId": 21,
                "companyAddr": null,
                "companyEnglishName": "Limited Liability Company",
                "companyChineseName": "Limited Liability Company",
                "bankName": "Pingpong",
                "companyStatus": 1,
                "updatedId": "-1",
                "updatedName": "系统",
                "updatedAt": "2023-11-29T09:09:46"
            },
            {
                "companyName": "洪堡",
                "companyCode": "CNSZHB",
                "companyId": 1,
                "companyAddr": "addr",
                "companyEnglishName": "hongbaossaas",
                "companyChineseName": "洪堡全名",
                "bankName": "Pingpong",
                "companyStatus": -1,
                "updatedId": "1",
                "updatedName": "admin",
                "updatedAt": "2023-11-13T02:42:04"
            },
            {
                "companyName": "test-cynthia",
                "companyCode": "JDXZIH",
                "companyId": 259,
                "companyAddr": null,
                "companyEnglishName": "sd",
                "companyChineseName": "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊",
                "bankName": "Pingpong",
                "companyStatus": 1,
                "updatedId": "-1",
                "updatedName": "系统",
                "updatedAt": "2023-10-25T09:41:10"
            },
            {
                "companyName": "esigntest重庆异连科技有限公司PAAX",
                "companyCode": "BDEL7V",
                "companyId": 269,
                "companyAddr": null,
                "companyEnglishName": null,
                "companyChineseName": "esigntest重庆异连科技有限公司PAAX",
                "bankName": "Pingpong",
                "companyStatus": 1,
                "updatedId": "-1",
                "updatedName": "系统",
                "updatedAt": "2023-10-12T04:45:44"
            },
            {
                "companyName": "testone",
                "companyCode": "3U6HVP",
                "companyId": 45,
                "companyAddr": null,
                "companyEnglishName": "testone full name",
                "companyChineseName": "太撕特全称中文",
                "bankName": "Pingpong",
                "companyStatus": 1,
                "updatedId": "-1",
                "updatedName": "系统",
                "updatedAt": "2023-10-11T11:16:27"
            },
            {
                "companyName": "nic公司",
                "companyCode": "N6J9KV",
                "companyId": 321,
                "companyAddr": null,
                "companyEnglishName": "nic Inc.",
                "companyChineseName": "公司全称公司全称",
                "bankName": "Pingpong",
                "companyStatus": 1,
                "updatedId": "-1",
                "updatedName": "系统",
                "updatedAt": "2023-11-30T03:16:24"
            },
            {
                "companyName": "CynthiaTest",
                "companyCode": "WCISMC",
                "companyId": 771,
                "companyAddr": null,
                "companyEnglishName": "Cynthia`s Auto Testing Company",
                "companyChineseName": "倩倩的自动化测试公司",
                "bankName": "Pingpong",
                "companyStatus": 1,
                "updatedId": "1",
                "updatedName": "admin",
                "updatedAt": "2023-11-30T07:00:56"
            },
            {
                "companyName": "Zgrill",
                "companyCode": "CNSZZG",
                "companyId": 8,
                "companyAddr": null,
                "companyEnglishName": null,
                "companyChineseName": "重庆异连科技有限公司",
                "bankName": "Pingpong",
                "companyStatus": 1,
                "updatedId": "-1",
                "updatedName": "系统",
                "updatedAt": "2023-10-12T10:41:41"
            },
            {
                "companyName": "千岸",
                "companyCode": "CNSZQA",
                "companyId": 9,
                "companyAddr": null,
                "companyEnglishName": "QIANAN COMPANY NAME.",
                "companyChineseName": "千岸公司全称",
                "bankName": "Pingpong",
                "companyStatus": 1,
                "updatedId": "1",
                "updatedName": "admin",
                "updatedAt": "2023-11-30T11:02:55"
            },
            {
                "companyName": "瑞康诺",
                "companyCode": "CNSZRN",
                "companyId": 21,
                "companyAddr": null,
                "companyEnglishName": "Limited Liability Company",
                "companyChineseName": "Limited Liability Company",
                "bankName": "Pingpong",
                "companyStatus": 1,
                "updatedId": "-1",
                "updatedName": "系统",
                "updatedAt": "2023-11-29T09:09:46"
            },
            {
                "companyName": "洪堡",
                "companyCode": "CNSZHB",
                "companyId": 1,
                "companyAddr": "addr",
                "companyEnglishName": "hongbaossaas",
                "companyChineseName": "洪堡全名",
                "bankName": "Pingpong",
                "companyStatus": -1,
                "updatedId": "1",
                "updatedName": "admin",
                "updatedAt": "2023-11-13T02:42:04"
            },
            {
                "companyName": "test-cynthia",
                "companyCode": "JDXZIH",
                "companyId": 259,
                "companyAddr": null,
                "companyEnglishName": "sd",
                "companyChineseName": "啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊",
                "bankName": "Pingpong",
                "companyStatus": 1,
                "updatedId": "-1",
                "updatedName": "系统",
                "updatedAt": "2023-10-25T09:41:10"
            },
            {
                "companyName": "esigntest重庆异连科技有限公司PAAX",
                "companyCode": "BDEL7V",
                "companyId": 269,
                "companyAddr": null,
                "companyEnglishName": null,
                "companyChineseName": "esigntest重庆异连科技有限公司PAAX",
                "bankName": "Pingpong",
                "companyStatus": 1,
                "updatedId": "-1",
                "updatedName": "系统",
                "updatedAt": "2023-10-12T04:45:44"
            },
            {
                "companyName": "testone",
                "companyCode": "3U6HVP",
                "companyId": 45,
                "companyAddr": null,
                "companyEnglishName": "testone full name",
                "companyChineseName": "太撕特全称中文",
                "bankName": "Pingpong",
                "companyStatus": 1,
                "updatedId": "-1",
                "updatedName": "系统",
                "updatedAt": "2023-10-11T11:16:27"
            },
            {
                "companyName": "nic公司",
                "companyCode": "N6J9KV",
                "companyId": 321,
                "companyAddr": null,
                "companyEnglishName": "nic Inc.",
                "companyChineseName": "公司全称公司全称",
                "bankName": "Pingpong",
                "companyStatus": 1,
                "updatedId": "-1",
                "updatedName": "系统",
                "updatedAt": "2023-11-30T03:16:24"
            },
            {
                "companyName": "CynthiaTest",
                "companyCode": "WCISMC",
                "companyId": 771,
                "companyAddr": null,
                "companyEnglishName": "Cynthia`s Auto Testing Company",
                "companyChineseName": "倩倩的自动化测试公司",
                "bankName": "Pingpong",
                "companyStatus": 1,
                "updatedId": "1",
                "updatedName": "admin",
                "updatedAt": "2023-11-30T07:00:56"
            },
            {
                "companyName": "Zgrill",
                "companyCode": "CNSZZG",
                "companyId": 8,
                "companyAddr": null,
                "companyEnglishName": null,
                "companyChineseName": "重庆异连科技有限公司",
                "bankName": "Pingpong",
                "companyStatus": 1,
                "updatedId": "-1",
                "updatedName": "系统",
                "updatedAt": "2023-10-12T10:41:41"
            }
        ];
        return (
                <SptCollapsibleAlert {...args} >
                    {
                        noPingpongRelationList?.map((item) => (
                            <span key={item.companyId} style={{paddingRight: '12px'}}>
                                <Typography.Link
                                    onClick={() => null}
                                >
                                    {item.companyName}
                                </Typography.Link>
                            </span>
                        ))
                    }
                </SptCollapsibleAlert>
        );
    }
};