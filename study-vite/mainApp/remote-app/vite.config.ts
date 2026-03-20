import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "remote_app", // 给远程应用取一个全局唯一名
      filename: "remoteEntry.js", // 输出的联邦入口文件名
      exposes: {
        // key: [import 在 Host 端引用时的路径]
        // value: 源文件相对 vite.config.js 的实际路径
        "./TestButton": "./src/TestButton.tsx",
      },
      shared: ['react', 'react-dom']
     
    }),
  ],
  build: {
    target: "esnext",
  },

  esbuild: {
    target: "esnext",
  },
});
