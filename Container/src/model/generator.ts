import { ModuleTypes } from '@spotter/lowcode-common';
import { nanoid } from 'nanoid';
import { ContainerModuleModel } from './schema';

const genDefaultConfigModel = (index: number): ContainerModuleModel => {
    return {
        index,
        componentType: ModuleTypes.Container,
        key: `${ModuleTypes.Container}_${nanoid(8)}`,
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
};
export default genDefaultConfigModel;
