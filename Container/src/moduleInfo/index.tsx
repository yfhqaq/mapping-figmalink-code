import { TableOutlined } from "@ant-design/icons";
import { ModuleInfo, ModuleTypes } from "@spotter/lowcode-common";

export const getModuleInfo = (): ModuleInfo => {
  return {
    componentType: ModuleTypes.Container,
    description: "Container",
    icon: () => <TableOutlined />,
    version: "0.0.1",
    name: "容器",
    docUrl: "",
  }
}
