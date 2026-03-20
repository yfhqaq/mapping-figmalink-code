import { Piscina } from 'piscina';
import type { IBundlessConfig } from 'src/builder/config';
import { IApi } from 'src/types';
import type { Loaders, Transformers } from '.';
declare const _default: () => Piscina<{
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
}, any>;
export default _default;
