// vite.config.ts
import react from '@vitejs/plugin-react';
import path from 'path';
import UnoCSS from 'unocss/vite';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import packages from './package.json'

function resolve(str: string) {
    return path.resolve(__dirname, str);
}

export default defineConfig({
    plugins: [
        react(),
        dts({
            include: ['src'],
            root: '.',
        }),
        UnoCSS({
            mode: 'per-module',
        }),
    ],
    build: {
        // 打包输出的目录
        outDir: 'lib',
        lib: {
            // 组件库源码的入口文件
            entry: resolve('./src/rollup-index.ts'),
            formats: ['es', 'cjs'],
            fileName: 'index',
        },
        rollupOptions: {
            // 确保外部化处理那些你不想打包进库的依赖
            external: [
                ...Object.keys(packages.peerDependencies),
                ...Object.keys(packages.devDependencies),
            ]
        },
        sourcemap: true
    },
});
