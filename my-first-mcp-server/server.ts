import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio';
import { z } from 'zod';

const mcpServer = new McpServer({
    name: 'personal-tasks',
    version: '1.0.0',
});

// 定义算术工具的输入Schema
const AddParams = z.object({
    a: z.number().describe('第一个数字'),
    b: z.number().describe('第二个数字'),
});

const SubtractParams = z.object({
    a: z.number().describe('第一个数字'),
    b: z.number().describe('第二个数字'),
});

// 注册加法工具
mcpServer.registerTool('add', {
    description: '将两个数字相加',
    inputSchema: AddParams,
}, async (params: z.infer<typeof AddParams>) => {
    const result = params.a + params.b;
    console.log(`执行 add 工具：${params.a} + ${params.b} = ${result}`);
    return {
        content: [
            { type: 'text', text: `加法结果：${result}` }
        ]
    };
});

// 注册减法工具
mcpServer.registerTool('subtract', {
    description: '从第一个数字中减去第二个数字',
    inputSchema: SubtractParams,
}, async (params: z.infer<typeof SubtractParams>) => {
    const result = params.a - params.b;
    console.log(`执行 subtract 工具：${params.a} - ${params.b} = ${result}`);
    return {
        content: [
            { type: 'text', text: `减法结果：${result}` }
        ]
    };
});

const transport = new StdioServerTransport();

mcpServer.connect(transport);
transport.start();

console.log('MCP Server 已启动并注册了算术工具！');