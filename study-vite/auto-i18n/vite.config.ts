import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { babel } from '@rollup/plugin-babel';

export default defineConfig({
  build: {
    minify: false,
  },
  plugins: [
    react(),
    babel({
      babelHelpers: 'bundled', // 必须指定
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
      ],
      plugins: [
        // 直接嵌入自定义 Babel 插件代码
        function customAuthWrapPlugin() {
          console.log('执行插件')
          return {
            visitor: {
              JSXElement(path: { node: { openingElement: { attributes: any; }; }; parentPath: { isJSXExpressionContainer: () => any; parentPath: { isLogicalExpression: () => any; replaceWith: (arg0: any) => void; node: any; }; }; replaceWith: (arg0: any) => void; }) {
                console.log('遇到 JSX 元素啦！'); // 打印日志以确认插件生效
                const t = require('@babel/types'); // 确保可以使用 Babel 类型工具
                // 获取 JSX 的所有属性
                const attributes = path.node.openingElement.attributes;

                // 查找 data-auth-keys 属性
                const authAttrIndex = attributes.findIndex((attr: { name: { name: string; }; }) =>
                  t.isJSXAttribute(attr) &&
                  t.isJSXIdentifier(attr.name) &&
                  attr.name.name === 'data-auth-keys'
                );

                if (authAttrIndex === -1) {
                  console.log('没有找到 data-auth-keys 属性');
                  return; // 没有找到 data-auth-keys，直接返回
                }

                console.log('找到 data-auth-keys 属性:', attributes[authAttrIndex]);

                const authAttr = attributes[authAttrIndex];
                let authExpression = null;

                // 构建 hasAuth 表达式
                if (t.isJSXExpressionContainer(authAttr.value)) {
                  const expr = authAttr.value.expression;

                  if (t.isArrayExpression(expr)) {
                    console.log('data-auth-keys 是一个数组');
                    // data-auth-keys={['key1', 'key2']}
                    const authConditions = expr.elements.map((element: any) =>
                      t.callExpression(t.identifier('hasAuth'), [element])
                    );
                    authExpression = authConditions.reduce((acc: any, curr: any) =>
                      t.logicalExpression('||', acc, curr)
                    );
                  } else if (t.isStringLiteral(expr)) {
                    console.log('data-auth-keys 是一个字符串');
                    // data-auth-keys="key3"
                    authExpression = t.callExpression(t.identifier('hasAuth'), [expr]);
                  }
                } else if (t.isStringLiteral(authAttr.value)) {
                  console.log('data-auth-keys 是一个直接字符串');
                  // data-auth-keys="key3" (直接字符串形式)
                  authExpression = t.callExpression(t.identifier('hasAuth'), [authAttr.value]);
                }

                if (!authExpression) {
                  console.log('没有生成有效的 auth 表达式');
                  return; // 如果没有合法的表达式，返回
                }

                console.log('生成的 auth 表达式:', authExpression);

                // 移除 data-auth-keys 属性
                attributes.splice(authAttrIndex, 1);

                // 检查 JSX 元素是否已经被包裹在条件判断中
                if (
                  path.parentPath.isJSXExpressionContainer() &&
                  path.parentPath.parentPath.isLogicalExpression()
                ) {
                  console.log('JSX 元素已被包裹在条件判断中，添加 hasAuth 检查');
                  // 已经有条件判断，直接添加 hasAuth 判断条件
                  path.parentPath.parentPath.replaceWith(
                    t.logicalExpression('&&', authExpression, path.parentPath.parentPath.node)
                  );
                } else {
                  console.log('包裹 JSX 元素');
                  // 包裹 JSX 元素
                  const conditionalExpression = t.jsxExpressionContainer(
                    t.logicalExpression('&&', authExpression, path.node)
                  );

                  path.replaceWith(
                    t.jsxFragment(
                      t.jsxOpeningFragment(),
                      t.jsxClosingFragment(),
                      [conditionalExpression]
                    )
                  );
                }
              }
            }
          };
        },
      ],
      extensions: ['.js', '.jsx', '.ts', '.tsx'], // 需要处理的文件扩展名
      include: ['src/**/*'], // 指定处理的文件范围
    }),
  ],
});
