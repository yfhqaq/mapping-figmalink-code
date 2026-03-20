import type { Options } from "@storybook/core-common";
import type { AddonOptionsVite, AddonOptionsWebpack } from "./types";
export declare const viteFinal: (viteConfig: Record<string, any>, options: Options & AddonOptionsVite) => Promise<Record<string, any>>;
export declare const webpackFinal: (webpackConfig: Record<string, any>, options: Options & AddonOptionsWebpack) => Promise<Record<string, any>>;
