import { ModuleConfigForm } from "./internal/ModuleConfigForm";
import { ModuleFunctional } from "./internal/ModuleFunctional";
import genDefaultConfigModel from "./model/generator";
import { preSave } from "./model/preSave";
import { postValidator, preValidator } from "./model/validator";
import { getModuleInfo } from "./moduleInfo";

const moduleInfo = getModuleInfo();
const components = {
  moduleFunctional: ModuleFunctional,
  moduleConfigForm: ModuleConfigForm,
}
export const sptTabWithBadgeModule = {
  test: '1111111',
  moduleInfo,
  genDefaultConfigModel,
  preValidator,
  postValidator,
  preSave,
  components
}
export default sptTabWithBadgeModule

