import { ModuleModel, ValidateResult } from "@spotter/lowcode-common";

export function preValidator(pageContents: ModuleModel[]): ValidateResult {
  const result: ValidateResult = {
    valid: true,
    message: "",
  };
  console.log("pageContents====>", pageContents);
  return result;
}

export function postValidator(pageContents: ModuleModel[]): ValidateResult {
  const result: ValidateResult = {
    valid: true,
    message: "",
  };
  console.log("pageContents====>", pageContents);
  return result;
}
