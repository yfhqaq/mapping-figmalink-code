import { ModuleModel, ValidateResult } from '../../../../packages/common/src/index.ts';
import { SptTabWithBadgeModuleModel } from "./schema";
export declare function preSave(model: ModuleModel, pageContens: SptTabWithBadgeModuleModel): Promise<ValidateResult>;
