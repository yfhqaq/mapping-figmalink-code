import { preSave } from "./model/preSave";
import { postValidator, preValidator } from "./model/validator";
export declare const sptTabWithBadgeModule: {
    test: string;
    moduleInfo: import('../../../packages/common/src/index.ts').ModuleInfo;
    genDefaultConfigModel: (index: number) => import(".").SptTabWithBadgeModuleModel;
    preValidator: typeof preValidator;
    postValidator: typeof postValidator;
    preSave: typeof preSave;
    components: {
        moduleFunctional: (props: {
            parentKey: any;
            config: import(".").SptTabWithBadgeModuleModel;
            editModel: boolean;
            updateCardInfo: (type: string, params: any) => void;
            curModuleKey: string;
        }) => JSX.Element;
        moduleConfigForm: ({ moduleConfig, updatePageContent }: {
            moduleConfig: import(".").SptTabWithBadgeModuleModel;
            updatePageContent: (params: import(".").SptTabWithBadgeModuleModel) => void;
        }) => JSX.Element;
    };
};
export default sptTabWithBadgeModule;
