import { chokidar } from '@umijs/utils';
import type { BundlessConfigProvider } from '../config';
import { IJSTransformer } from './loaders/types';
/**
 * loader item type
 */
interface ILoaderItem {
    id: string;
    test: string | RegExp | ((path: string) => boolean);
    loader: string;
    options?: Record<string, any>;
}
export type Loaders = ILoaderItem[];
/**
 * add loader
 * @param item  loader item
 */
export declare function addLoader(item: ILoaderItem): void;
export interface ITransformerItem {
    id: string;
    transformer: string;
}
export type Transformers = Record<string, IJSTransformer>;
/**
 * add javascript transformer
 * @param item
 */
export declare function addTransformer(item: ITransformerItem): void;
/**
 * transform specific files
 */
declare function transformFiles(files: string[], opts: {
    cwd: string;
    configProvider: BundlessConfigProvider;
    watch?: true;
    incremental?: boolean;
}): Promise<number>;
declare function bundless(opts: Omit<Parameters<typeof transformFiles>[1], 'watch'>): Promise<void>;
declare function bundless(opts: Parameters<typeof transformFiles>[1]): Promise<chokidar.FSWatcher>;
export default bundless;
