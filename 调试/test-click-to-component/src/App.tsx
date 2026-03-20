
import { Button,Space } from 'antd';
import Aaa from './Aaa';


const Demo = () => (
  <div>
    <Space>
      <Space direction="vertical">
        <Button defaultValue="#1677ff" size="small" children='21211' />
        <Button defaultValue="#1677ff" children='rege211' />
        <Button defaultValue="#1677ff" size="large" children='477411' />
      </Space>
      <Space direction="vertical">
        <Button defaultValue="#1677ff" size="small" children='21787891'   type='ghost'/>
        <Button defaultValue="#1677ff"  type='text' children='2535611' />
        <Button defaultValue="#1677ff" size="large" type='primary' children='2124535' />
      </Space>
    </Space>
    <Aaa></Aaa>
  </div>
);

export default Demo;
