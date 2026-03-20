const fs = require('fs');
const path = require('path');
const glob = require('glob');
const babelParser = require('@babel/parser')
const babelTraverse = require('@babel/traverse').default
const babelGenerator = require('@babel/generator').default
const t = require('@babel/types');
// 获取项目的根目录
const rootDir = process.cwd();

// 构建 src 目录的路径
const srcDir = path.join(rootDir, 'src');
function containsChineseCharacters(str) {
    const chineseCharPattern = /[\u4e00-\u9fa5]/;
    return chineseCharPattern.test(str);
}
// 使用 glob 查找所有 .js, .ts, .tsx 文件
const files = glob.globSync("**/*.{js,ts,tsx}", { cwd: srcDir });
// 遍历每个文件，读取并打印内容
files.forEach(file => {
    const filePath = path.join(srcDir, file);
    try {
        // 使用 readFileSync 读取文件内容
        const content = fs.readFileSync(filePath, 'utf-8');

        const parseAst = babelParser.parse(content, {
            sourceType: 'module',
            plugins: ["jsx", "typescript"]
        })
        babelTraverse(parseAst, {
            FunctionDeclaration(path, state) {
                const functionName = path.node.id.name;
                // 如果这个函数名是我们要检查的函数 (假设是 `a`)
                if (functionName === 'myfunction') {
                    const binding = path.scope.getBinding(functionName);

                    // 遍历所有对 `a` 的引用
                    binding.referencePaths.forEach(refPath => {
                        let parentPath = refPath.parentPath;
                        while (parentPath && !t.isCallExpression(parentPath.node)) {
                            parentPath = parentPath.parentPath;
                        }
                        console.log(parentPath, 'parentPath')
                        if (parentPath && t.isCallExpression(parentPath.node) && parentPath.node.callee.name === 'myfunction') {
                            console.log('Function is being called:', parentPath.node);
                            // 检查是否在顶层调用
                            if (!parentPath.getFunctionParent()) {
                                console.log(`Function ${functionName} is called at the top level`);
                            } else {
                                console.log(`Function ${functionName} is called in a nested function`);
                            }
                        }
                    });
                }
            },
            Program(path) {
                let hasImportStatement = false;

                // 遍历 ImportDeclaration 节点，检查是否已导入 useSt
                path.node.body.forEach(node => {
                    if (
                        t.isImportDeclaration(node) &&
                        node.source.value === '@client/app/infra/i18n'
                    ) {
                        const specifier = node.specifiers.find(specifier =>
                            t.isImportSpecifier(specifier) && specifier.imported.name === 'useSt'
                        );
                        if (specifier) {
                            hasImportStatement = true;
                        }
                    }
                });

                // 如果没有导入 useSt，则在顶部插入 import 语句
                if (!hasImportStatement) {
                    const importDeclaration = t.importDeclaration(
                        [t.importSpecifier(t.identifier('useSt'), t.identifier('useSt'))],
                        t.stringLiteral('@client/app/infra/i18n')
                    );
                    path.node.body.unshift(importDeclaration);
                }
            },
        })
        const newCode = babelGenerator(parseAst)
    } catch (err) {
        console.error(`Error reading file ${file}:`, err);
    }
});

