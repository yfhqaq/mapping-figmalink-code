import { ContentAdvancedConfig, ContentBasicConfig, ContentStyleConfig, EventsConfig, ModuleModel, ModuleTypes, SetterValue } from "@spotter/lowcode-common";






export interface SptTabWithBadgeContentConfig {
  basic: BasicConfig;
  style: ContentStyleConfig;
  events: EventsConfig;
  advanced?: AdvancedConfig;
}

export enum Fixed_Enum {
  right = 'right',
  left = 'left'
}

export const FIXED_Enum_Map = {
  [Fixed_Enum.right]: {
    text: 'right',
    value: Fixed_Enum.right
  },
  [Fixed_Enum.left]: {
    text: 'left',
    value: Fixed_Enum.left
  },
}

export enum Fit_Enum {
  auto = 'auto',
  content = 'content',
  container = 'container',
  none = 'none'
}
export interface TabWithBadgeConfig {
  rowKey: SetterValue<undefined>,
  width?: string | number | true;
  columnResizable?: SetterValue<undefined>;
  cacheKey?: string,
  toolBarRender?: SetterValue<undefined>;
  fit?: Fit_Enum;
  drawerTrigger?: boolean;
  onRowDrawerChange?: SetterValue<undefined>;
  onRowSelection?: SetterValue<undefined>;
  inheritAction?: boolean;
}
export interface BasicConfig extends ContentBasicConfig {
  props: {
    customStyle: Record<string, string>; // 自定义样式
  },
  attrs: {

  }
}
export interface SptTabWithBadgeModuleModel extends ModuleModel {
  componentType: ModuleTypes;
  key: string;
  content: SptTabWithBadgeContentConfig;
  container: boolean;
  internal: boolean;
  children: ModuleModel[];
  tabs: any[];
}

export interface AdvancedConfig extends ContentAdvancedConfig {
  condition: SetterValue<boolean>; // 高级设置，是否开启高级设置
}
