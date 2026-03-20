import type { BundleConfigProvider } from '../config';
export interface IBundleWatcher {
    close: () => void;
}
interface IBundleOpts {
    cwd: string;
    configProvider: BundleConfigProvider;
    buildDependencies?: string[];
    watch?: boolean;
    incremental?: boolean;
}
declare function bundle(opts: Omit<IBundleOpts, 'watch' | 'incremental'>): Promise<void>;
declare function bundle(opts: IBundleOpts): Promise<IBundleWatcher>;
export default bundle;
