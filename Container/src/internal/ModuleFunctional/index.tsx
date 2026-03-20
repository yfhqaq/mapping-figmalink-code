import { ModuleAssembleRender } from '@spotter/lowcode-core';
import { ContainerModuleModel } from '../../model/schema';

export const ModuleFunctional = (props: {
    config: ContainerModuleModel;
    moduleProps: any;
    editModel: boolean;
    updateCardInfo: (type: string, params: any) => void;
    curModuleKey: string;
}) => {
    const { config, moduleProps, curModuleKey, editModel, updateCardInfo } = props;
    const {
        key,
        children,
        content: {
            basic: { customStyle },
        },
    } = { ...config };

    return (
        <div
            className="min-h-70px w-full flex items-center border-1px p-8px"
            style={{ border: '1px solid #e5e5e5', ...customStyle }}
        >
            <ModuleAssembleRender
                parentId={key}
                curModuleKey={`${curModuleKey}`}
                pageContents={children ?? []}
                editModel={editModel}
                updateCardInfo={updateCardInfo}
                moduleProps={moduleProps}
            />
        </div>
    );
};
