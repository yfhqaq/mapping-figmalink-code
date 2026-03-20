import { AddonOptionsWebpack } from "./types";
export declare function createTestExclude(opts?: AddonOptionsWebpack["istanbul"]): Promise<{
    shouldInstrument(filename: string): boolean;
}>;
