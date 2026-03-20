import { getModuleInfo } from "../moduleInfo";
import { ModuleFunctional } from "../internal/ModuleFunctional"

const moduleInfo = getModuleInfo();
const components = {
  moduleFunctional: ModuleFunctional,
}
export const sptTabWithBadgeModule = {
  components,
  moduleInfo
}

