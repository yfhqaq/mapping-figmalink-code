import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Test } from './test'
export function hasAuth(authKey: string) {
  if (authKey === 'key1') {
    return true
  }
  return false
}
function myfunction() {

  return {
    t: '1111'
  }
}
function App() {
  const [count, setCount] = useState(0)
  const [testStr, setTestStr] = useState('app测试数据')
  const data = myfunction
  console.log(data)
  return (
    <>
      {testStr}
      <button data-auth-keys={['key2', 'key3']} onClick={() => {
        setTestStr('测试数据被改变啦！')
      }}></button>
      <Test data-auth-keys={'key1'}></Test>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
