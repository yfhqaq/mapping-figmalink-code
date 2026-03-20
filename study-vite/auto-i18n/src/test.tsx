import { useState } from 'react';
import { MyButton } from './button';

export function Test() {

    const [text, setText] = useState('1212121')
    const [testData, setTestData] = useState('测试自动国际化')
    console.log(testData)
    const fn = () => {
        setTestData('改变测试国际化数据')
        setText('12112')
    }
    return <>
        <MyButton />
        <button onClick={() => {
            fn()
        }}>测试国际化数据按钮-----{text}</button>
    </>
}