/**
 * get tsconfig.json path for specific path
 */
export declare function getTsconfigPath(cwd: string): string | undefined;
/**
 * get parsed tsconfig.json for specific path
 * ref: https://github.com/privatenumber/get-tsconfig#how-can-i-use-typescript-to-parse-tsconfigjson
 */
export declare function getTsconfig(cwd: string): import("typescript").ParsedCommandLine | undefined;
/**
 * get declarations for specific files
 */
export default function getDeclarations(inputFiles: string[], opts: {
    cwd: string;
}): Promise<{
    file: string;
    content: string;
    sourceFile: string;
}[]>;
