const babel = require('@babel/core');
const t = require('@babel/types');

module.exports = function () {
    return {
        visitor: {
            JSXElement(path) {
                // 获取 JSX 的所有属性
                const attributes = path.node.openingElement.attributes;

                // 查找 data-auth-keys 属性
                const authAttrIndex = attributes.findIndex(attr =>
                    t.isJSXAttribute(attr) &&
                    t.isJSXIdentifier(attr.name) &&
                    attr.name.name === 'data-auth-keys'
                );

                if (authAttrIndex === -1) return; // 没有找到 data-auth-keys，直接返回

                const authAttr = attributes[authAttrIndex];
                let authExpression = null;

                // 构建 hasAuth 表达式
                if (t.isJSXExpressionContainer(authAttr.value)) {
                    const expr = authAttr.value.expression;

                    if (t.isArrayExpression(expr)) {
                        // data-auth-keys={['key1', 'key2']}
                        const authConditions = expr.elements.map(element =>
                            t.callExpression(t.identifier('hasAuth'), [element])
                        );
                        authExpression = authConditions.reduce((acc, curr) =>
                            t.logicalExpression('||', acc, curr)
                        );
                    } else if (t.isStringLiteral(expr)) {
                        // data-auth-keys="key3"
                        authExpression = t.callExpression(t.identifier('hasAuth'), [expr]);
                    }
                } else if (t.isStringLiteral(authAttr.value)) {
                    // data-auth-keys="key3" (直接字符串形式)
                    authExpression = t.callExpression(t.identifier('hasAuth'), [authAttr.value]);
                }

                if (!authExpression) return; // 如果没有合法的表达式，返回

                // 移除 data-auth-keys 属性
                attributes.splice(authAttrIndex, 1);

                // 检查 JSX 元素是否已经被包裹在条件判断中
                if (
                    path.parentPath.isJSXExpressionContainer() &&
                    path.parentPath.parentPath.isLogicalExpression()
                ) {
                    // 已经有条件判断，直接添加 hasAuth 判断条件
                    path.parentPath.parentPath.replaceWith(
                        t.logicalExpression('&&', authExpression, path.parentPath.parentPath.node)
                    );
                } else {
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
};
