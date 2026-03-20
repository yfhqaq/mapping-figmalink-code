import { ContentAdvancedConfig, ContentBasicConfig, ContentStyleConfig, EventsConfig, ModuleModel, ModuleTypes, SetterValue } from '../../../../packages/common/src/index.ts';
export interface SptTabWithBadgeContentConfig {
    basic: BasicConfig;
    style: ContentStyleConfig;
    events: EventsConfig;
    advanced?: AdvancedConfig;
}
export declare enum Fixed_Enum {
    right = "right",
    left = "left"
}
export declare const FIXED_Enum_Map: {
    right: {
        text: string;
        value: Fixed_Enum;
    };
    left: {
        text: string;
        value: Fixed_Enum;
    };
};
export declare enum Fit_Enum {
    auto = "auto",
    content = "content",
    container = "container",
    none = "none"
}
export interface TabWithBadgeConfig {
    rowKey: SetterValue<undefined>;
    width?: string | number | true;
    columnResizable?: SetterValue<undefined>;
    cacheKey?: string;
    toolBarRender?: SetterValue<undefined>;
    fit?: Fit_Enum;
    drawerTrigger?: boolean;
    onRowDrawerChange?: SetterValue<undefined>;
    onRowSelection?: SetterValue<undefined>;
    inheritAction?: boolean;
}
export interface BasicConfig extends ContentBasicConfig {
    props: {
        customStyle: Record<string, string>;
    };
    attrs: {};
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
    condition: SetterValue<boolean>;
}
