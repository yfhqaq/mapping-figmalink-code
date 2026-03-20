import { CliOptions } from './getCliOptions.js';
import 'jest-playwright-preset';

type ParsedCliOptions = {
    options: CliOptions['runnerOptions'];
    extraArgs: CliOptions['jestOptions'];
};
declare const getParsedCliOptions: () => ParsedCliOptions;

export { getParsedCliOptions };
