import {
    ContentAdvancedConfig,
    ContentBasicConfig,
    ContentStyleConfig,
    EventsConfig,
    ModuleModel,
    ModuleTypes,
    SetterValue,
} from '@spotter/lowcode-common';

export interface ContainerProps {
    span?: SetterValue<string>;
    gutter?: SetterValue<string>;
}

export interface ContainerContentConfig {
    basic: BasicConfig;
    style: ContentStyleConfig;
    events: EventsConfig;
    advanced?: AdvancedConfig;
}

export interface BasicConfig extends ContentBasicConfig {
    props: {
        customStyle: Record<string, string>; // 自定义样式
    };
}

export interface ContainerModuleModel extends ModuleModel {
    componentType: ModuleTypes;
    key: string;
    content: ContainerContentConfig;
    container: boolean;
    internal: boolean;
    children: ModuleModel[];
}

export interface AdvancedConfig extends ContentAdvancedConfig {
    condition: SetterValue<boolean>; // 高级设置，是否开启高级设置
}
