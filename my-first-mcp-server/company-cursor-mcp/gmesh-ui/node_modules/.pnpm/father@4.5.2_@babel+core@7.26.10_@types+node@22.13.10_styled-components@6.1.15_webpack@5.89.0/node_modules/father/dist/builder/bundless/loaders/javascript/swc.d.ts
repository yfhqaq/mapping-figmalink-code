import { IJSTransformerFn } from '../types';
/**
 * replace absolute path with relative path
 */
export declare const replaceAbsPathWithRelativePath: (opts: {
    content: string;
    cwd: string;
    fileAbsPath: string;
}) => string;
/**
 * swc transformer
 */
declare const swcTransformer: IJSTransformerFn;
export default swcTransformer;
