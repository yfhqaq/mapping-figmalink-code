import { AddonOptionsWebpack } from "./types";
export declare function getNycConfig(opts?: Pick<AddonOptionsWebpack["istanbul"], "cwd" | "nycrcPath">): Promise<any>;
