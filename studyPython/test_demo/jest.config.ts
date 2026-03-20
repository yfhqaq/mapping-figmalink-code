export default {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/jest-dom-setup.js"],
  moduleNameMapper: {
    // 样式文件 mock
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // 图片、SVG 等静态资源 mock
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/__mocks__/fileMock.js",
  },
};
