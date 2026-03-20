const { Project } = require('ts-morph');
const fs = require('fs');
const path = require('path');

// 临时 TypeScript 配置文件的路径
const tsConfigFilePath = path.resolve(__dirname, 'tsconfig.temp.json');

// 创建临时的 TypeScript 配置文件
const tsConfigContent = {
    compilerOptions: {
        target: "ESNext",
        module: "CommonJS",
        lib: ["DOM", "ESNext"],
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true
    },
    include: ["src/**/*.ts", "src/**/*.tsx"]
};

fs.writeFileSync(tsConfigFilePath, JSON.stringify(tsConfigContent, null, 2));

// 创建一个 TypeScript 项目
const project = new Project({
    tsConfigFilePath,
    skipAddingFilesFromTsConfig: true,
    useInMemoryFileSystem: true
});

// 将 TypeScript 类型转换为 JSON Schema
function typeToJsonSchema(type) {
    const properties = {};

    type.getProperties().forEach(prop => {
        const propType = prop.getTypeAtLocation(prop.getDeclarations()[0]);
        properties[prop.getName()] = { type: mapTsTypeToSchemaType(propType.getText()) };
    });

    return {
        type: 'object',
        properties
    };
}

// 映射 TypeScript 类型到 JSON Schema 类型
function mapTsTypeToSchemaType(tsType) {
    switch (tsType) {
        case 'string':
        case 'number':
        case 'boolean':
            return tsType;
        case 'React.ReactNode':
        case 'ReactNode':
            return 'string'; // 简化处理 ReactNode 为字符串
        case 'void':
            return 'null';
        default:
            if (tsType.includes('|')) {
                return 'string'; // 简化处理联合类型为字符串
            }
            return 'object'; // 默认返回对象类型
    }
}

// 递归解析类型
function resolveType(type, seenTypes = new Set()) {
    if (seenTypes.has(type.getText())) return {};
    seenTypes.add(type.getText());

    if (type.isIntersection() || type.isUnion()) {
        const schemas = type.getIntersectionTypes().map(t => resolveType(t, seenTypes));
        return Object.assign({}, ...schemas);
    }

    if (type.getProperties().length > 0) {
        return typeToJsonSchema(type);
    }

    if (type.isArray()) {
        return {
            type: 'array',
            items: resolveType(type.getArrayElementTypeOrThrow(), seenTypes)
        };
    }

    return { type: mapTsTypeToSchemaType(type.getText()) };
}

// 生成 JSON Schema 的函数
function generateJsonSchema(filePath, typeName, typeCategory) {
    // 添加类型定义文件
    project.addSourceFileAtPath(filePath);

    // 获取类型
    const sourceFile = project.getSourceFileOrThrow(filePath);
    let type;
    if (typeCategory === 'type') {
        type = sourceFile.getTypeAliasOrThrow(typeName).getType();
    } else if (typeCategory === 'interface') {
        type = sourceFile.getInterfaceOrThrow(typeName).getType();
    } else {
        throw new Error(`Unknown type category: ${typeCategory}`);
    }

    // 解析类型并生成 JSON Schema
    const jsonSchema = resolveType(type);

    // 保存 JSON Schema 到文件
    const outputFilePath = path.resolve(__dirname, `${typeName}Schema.json`);
    fs.writeFileSync(outputFilePath, JSON.stringify(jsonSchema, null, 2));

    console.log(`JSON Schema generated for ${typeName}:`, jsonSchema);
}

// 示例调用
const filePath = path.resolve(__dirname, 'node_modules/antd/es/button/button.d.ts');
generateJsonSchema(filePath, 'ButtonProps', 'type');

// 删除临时的 TypeScript 配置文件
fs.unlinkSync(tsConfigFilePath);
