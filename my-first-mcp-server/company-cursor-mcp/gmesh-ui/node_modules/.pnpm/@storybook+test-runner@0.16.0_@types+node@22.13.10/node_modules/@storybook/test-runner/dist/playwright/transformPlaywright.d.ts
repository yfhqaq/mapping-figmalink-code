import { TestPrefixer } from '../csf/transformCsf.js';
import '@babel/types';

declare const testPrefixer: TestPrefixer;
declare const transformPlaywright: (src: string, filename: string) => string;

export { testPrefixer, transformPlaywright };
