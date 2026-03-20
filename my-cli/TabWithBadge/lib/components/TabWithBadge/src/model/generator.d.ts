import { ContentStyleConfig, EventsConfig, ModuleModel, ModuleTypes } from '../../../../packages/common/src/index.ts';
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
declare const genDefaultConfigModel: (index: number) => SptTabWithBadgeModuleModel;
export default genDefaultConfigModel;
