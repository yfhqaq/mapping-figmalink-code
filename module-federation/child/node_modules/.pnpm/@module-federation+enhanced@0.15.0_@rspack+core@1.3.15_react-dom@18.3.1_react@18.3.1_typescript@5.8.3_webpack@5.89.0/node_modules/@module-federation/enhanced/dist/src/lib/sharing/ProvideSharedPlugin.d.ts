import type { Compiler } from 'webpack';
import type { ProvideSharedPluginOptions, ProvidesConfig } from '../../declarations/plugins/sharing/ProvideSharedPlugin';
export type ResolvedProvideMap = Map<string, {
    config: ProvidesConfig;
    version: string | undefined | false;
    resource?: string;
}>;
declare class ProvideSharedPlugin {
    private _provides;
    /**
     * @param {ProvideSharedPluginOptions} options options
     */
    constructor(options: ProvideSharedPluginOptions);
    /**
     * Apply the plugin
     * @param {Compiler} compiler the compiler instance
     * @returns {void}
     */
    apply(compiler: Compiler): void;
}
export default ProvideSharedPlugin;
