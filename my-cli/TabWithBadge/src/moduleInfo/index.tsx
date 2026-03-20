import { AlignCenterOutlined } from "@ant-design/icons";
import { ModuleInfo, ModuleTypes } from "@spotter/lowcode-common";

export const getModuleInfo = (): ModuleInfo => {
  return {
    componentType: ModuleTypes.TabWithBadge,
    description: "统一标签页组件TabWithBadge",
    icon: ()=> <AlignCenterOutlined />,
    version: "0.0.1",
    name: "标签页",
    docUrl: "",
  }
}
