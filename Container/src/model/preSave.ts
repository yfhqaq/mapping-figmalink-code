import { ModuleModel, ValidateResult } from '@spotter/lowcode-common';
import { ContainerModuleModel } from './schema';

export async function preSave(
    model: ModuleModel,
    pageContens: ContainerModuleModel,
): Promise<ValidateResult> {
    console.log('model=====>', model, pageContens);
    const result: ValidateResult = {
        valid: true,
        message: '',
    };
    return result;
}
