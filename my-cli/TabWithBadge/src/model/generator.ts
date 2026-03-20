import { ContentStyleConfig, DynamicValueType, EventsConfig, ModuleModel, ModuleTypes } from "@spotter/lowcode-common";
import { nanoid } from "nanoid";
import { AdvancedConfig, BasicConfig, SptTabWithBadgeModuleModel } from "./schema";
export interface ContainerContentConfig {
  basic: BasicConfig;
  style: ContentStyleConfig;
  events: EventsConfig;
  advanced?: AdvancedConfig;
}
export interface ContainerModuleModel extends ModuleModel {
  componentType: ModuleTypes;
  key: string;
  content: ContainerContentConfig;
  container: boolean;
  internal: boolean;
  children: ModuleModel[];
}
const defaultModel = () => {
  return {
    componentType: ModuleTypes.DivContainer,
    key: `${ModuleTypes.DivContainer}_${nanoid(8)}`,
    children: [],
    // 默认属性
    container: false,
    internal: false,
    content: {
      basic: {
        props: {
          customStyle: {},
        },
        attrs: {},
      },
      style: {},
      events: [],
    },
  };
}

const gendefaultTabLabelModel = (index: number): ContainerModuleModel => {
  return {
    index,
    ...defaultModel()
  };
};

const gendefaultTabChildModel = (index: number, parentKey: any): ContainerModuleModel & { parentKey: any } => {
  return {
    index,
    parentKey: parentKey,
    ...defaultModel(),

  };
};
const genDefaultConfigModel = (index: number): SptTabWithBadgeModuleModel => {
  const defaultTabLabelModel = gendefaultTabLabelModel(0)
  const defaultTabParentKey = defaultTabLabelModel.key
  const defaultChildModel = gendefaultTabChildModel(1, defaultTabParentKey)
  return {
    index,
    componentType: ModuleTypes.TabWithBadge,
    key: `${ModuleTypes.TabWithBadge}_${nanoid(8)}`,
    content: {
      basic: {
        props: {
          customStyle: {},
        },
        attrs: {
          onClick: {
            default: '',
            dynamicValue: {
              dynamicValueType: DynamicValueType.expression,
              originCode: '',
              bundleCode: ''
            }
          },
        }
      },
      style: {},
      events: []
    },
    tabs: [defaultChildModel],
    container: false,
    internal: false,
    children: [defaultTabLabelModel],
  }
}
export default genDefaultConfigModel

