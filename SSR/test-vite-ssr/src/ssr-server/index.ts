import express, { RequestHandler, Express } from 'express';
import { ViteDevServer } from 'vite';
import * as path from 'path';
import { fetchData } from '../entry-server';
import { renderToString } from 'react-dom/server';
import React from 'react';
import * as fs from 'fs'
console.log('=======server-start')
const isProd = process.env.NODE_ENV === 'production';
const cwd = process.cwd();
function resolveTemplatePath() {
    return isProd ?
        path.join(cwd, 'dist/client/index.html') :
        path.join(cwd, 'index.html');
}
async function loadSsrEntryModule(vite: ViteDevServer | null) {
    // 生产模式下直接 require 打包后的产物
    if (isProd) {
        const entryPath = path.join(cwd, 'dist/server/entry-server.js');
        return require(entryPath);
    }
    // 开发环境下通过 no-bundle 方式加载
    else {
        const entryPath = path.join(cwd, 'src/entry-server.tsx');
        return vite!.ssrLoadModule(entryPath);
    }
}

async function createSsrMiddleware(app: Express): Promise<RequestHandler> {
    let vite: ViteDevServer | null = null;
    console.log('=======createSsrMiddleware')
    if (!isProd) {
        vite = await (await import('vite')).createServer({
            root: process.cwd(),
            server: {
                middlewareMode: true,
            }
        })
        // 注册 Vite Middlewares
        // 主要用来处理客户端资源
        app.use(vite.middlewares);
    }
    console.log('===createSsrMiddleware=======return')
    return async (req, res, next) => {
        // SSR 的逻辑
        // 1. 加载服务端入口模块
        const url = req.originalUrl;
        // 1. 服务端入口加载
        const { ServerEntry } = await loadSsrEntryModule(vite);
        // 2. 数据预取
        // 2. 预取数据
        const data = await fetchData();
        // 3. 「核心」渲染组件
        console.log(ServerEntry, data, '=======ServerEntry,data')
        const appHtml = renderToString(React.createElement(ServerEntry, { data }));
        console.log(appHtml, '========appHtml')
        // 4. 拼接完整 HTML 字符串，返回客户端
        const templatePath = resolveTemplatePath();
        let template = await fs.readFileSync(templatePath, 'utf-8');
        // 开发模式下需要注入 HMR、环境变量相关的代码，因此需要调用 vite.transformIndexHtml
        if (!isProd && vite) {
            template = await vite.transformIndexHtml(url, template);
        }
        const html = template
            .replace('<!-- SSR_APP -->', appHtml)
            // 注入数据标签，用于客户端 hydrate
            .replace(
                '<!-- SSR_DATA -->',
                `<script>window.__SSR_DATA__=${JSON.stringify(data)}</script>`
            );
        res.status(200).setHeader('Content-Type', 'text/html').end(html);
    }
}


async function createServer() {
    const app = express();
    // 加入 Vite SSR 中间件
    console.log('=====server拦截')
   
    app.use(await createSsrMiddleware(app));

    app.listen(3000, () => {
        console.log('Node 服务器已启动~')
        console.log('http://localhost:3000');
    });
}

createServer();
