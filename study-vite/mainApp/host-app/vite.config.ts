import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "host_app",
      remotes: {
        // key: 在本地导入时用的别名
        // value: 远程应用的 remoteEntry.js 完整 URL
        remote_app: "http://localhost:3001/assets/remoteEntry.js",
      },
      shared: {
        react: {
          requiredVersion: "^19.1.0",
        },
        "react-dom": {
          requiredVersion: "^19.1.0",
        },
      },
    }),
  ],
});
