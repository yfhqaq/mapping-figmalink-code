import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'

// @ts-ignore
const data = window.__SSR_DATA__;

ReactDOM.hydrate(
    <React.StrictMode>
        {/* @ts-ignore */}
        <App data={data} />
    </React.StrictMode>,
    document.getElementById('root')
)