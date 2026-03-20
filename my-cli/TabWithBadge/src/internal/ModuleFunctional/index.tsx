import { SptTabWithBadge } from '@spotter/ui'
import { ModuleAssembleRender, getBundleFun } from '@spotter/lowcode-core';
import { SetterValue, useSt } from '@spotter/lowcode-common';
import { SptTabWithBadgeModuleModel } from '../../model/schema';


export const ModuleFunctional = (props: {
    parentKey: any; config: SptTabWithBadgeModuleModel, editModel: boolean, updateCardInfo: (type: string, params: any) => void, curModuleKey: string
}) => {
    const t = useSt();
    const { config, updateCardInfo, editModel, curModuleKey } = props
    const { children, key, tabs } = { ...config };
    const getBundleFunReduce = (setterValue?: SetterValue<any>, params?: any) => {
        return getBundleFun(setterValue, { ...params, t })
    }


    const items = [...children.map((child, index) => {
        const curTab = tabs.filter((tab) => { return tab.parentKey === child.key })?.[0]
        console.log(curTab, '=============')
        return {
            key: child.key,
            label: <ModuleAssembleRender
                key={child.key}
                curModuleKey={curModuleKey}
                editModel={editModel}
                updateCardInfo={updateCardInfo}
                parentId={child.key}
                pageContents={[child]}
                moduleProps={{}}
            />,
            children: <ModuleAssembleRender
                key={curTab.key}
                curModuleKey={curModuleKey}
                editModel={editModel}
                updateCardInfo={updateCardInfo}
                parentId={curTab.key}
                pageContents={[curTab]}
                moduleProps={{}}
            />
        }
    }),
    ]
    return <SptTabWithBadge
        items={items}

    />
}
