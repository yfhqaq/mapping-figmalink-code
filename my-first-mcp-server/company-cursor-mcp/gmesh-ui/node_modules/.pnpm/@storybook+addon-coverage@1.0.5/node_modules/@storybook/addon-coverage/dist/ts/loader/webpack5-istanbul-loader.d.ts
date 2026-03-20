import { Instrumenter, InstrumenterOptions } from "istanbul-lib-instrument";
import { LoaderContext } from "webpack";
import { AddonOptionsWebpack } from "../types";
export declare type Options = Partial<InstrumenterOptions> & AddonOptionsWebpack & {
    instrumenter: Instrumenter;
};
declare type RawSourceMap = {
    version: number;
    sources: string[];
    mappings: string;
    file?: string;
    sourceRoot?: string;
    sourcesContent?: string[];
    names?: string[];
};
export default function (this: LoaderContext<Options>, source: string, sourceMap?: RawSourceMap): void;
export {};
