import { ModuleModel, ValidateResult } from "@spotter/lowcode-common";
import { SptTabWithBadgeModuleModel } from "./schema";

export async function preSave(model: ModuleModel, pageContens: SptTabWithBadgeModuleModel): Promise<ValidateResult> {
  console.log('model=====>', model, pageContens);
  const result: ValidateResult = {
    valid: true,
    message: "",
  };
  return result;
}
