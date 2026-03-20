import { ModuleFunctional } from "../internal/ModuleFunctional";
import { getModuleInfo } from "../moduleInfo";

const moduleInfo = getModuleInfo();
const components = {
  moduleFunctional: ModuleFunctional,
}
export const ContainerModule = {
  moduleInfo,
  components
}

