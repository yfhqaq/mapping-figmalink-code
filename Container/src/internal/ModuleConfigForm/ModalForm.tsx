import { TableOutlined } from '@ant-design/icons';
import { ModalForm, ProForm, ProFormText } from '@ant-design/pro-components';
import { Radio } from 'antd';
import { useState } from 'react';

export enum APIType {
  standard="standard",
  customs="customs"
}

const datasourceType = [
  {label: '统一接口', value: APIType.standard},
  {label: '自定义接口', value: APIType.customs}
]

export const TableConfigModal = ()=>{
  const [curApiType, setCurApiType] = useState<APIType>(APIType.standard)
  return <ModalForm
      title="表格配置"
      trigger={<TableOutlined />}
  >
      <ProForm.Item>
          数据来源1：
          <Radio.Group options={datasourceType} onChange={({target: {value}})=>{setCurApiType(value)}} value={curApiType} />
      </ProForm.Item>
      <ProForm.Item>
          接口：<ProFormText placeholder='http://' />
      </ProForm.Item>
      <ProForm.Item>
          接口id: <ProFormText />
      </ProForm.Item>
      <ProForm.Item>
          主键：<ProFormText initialValue='id' />
      </ProForm.Item>
  </ModalForm>
}
