import type { IApi } from '../../../types';
import type { IBundlessConfig } from '../../config';
import type { ILoaderOutput } from './types';
import type { Loaders, Transformers } from '..';
export interface ILoaderArgs {
    fileAbsPath: string;
    loaders: Loaders;
    fileDistPath: string;
    transformers: Transformers;
    opts: {
        config: IBundlessConfig;
        pkg: IApi['pkg'];
        cwd: string;
        itemDistAbsPath: string;
    };
}
/**
 * loader module base on webpack loader-runner
 */
declare const _default: (args: ILoaderArgs) => Promise<void | string[] | ILoaderOutput>;
export default _default;
