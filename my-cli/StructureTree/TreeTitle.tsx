import { DeleteOutlined, HolderOutlined } from "@ant-design/icons"
import { useStore } from "@client/app/store"
import { Dropdown, Popconfirm } from 'antd';
import { searchNodes } from "./utils"
import { cloneDeep } from "lodash"
import { globalModuleManager } from "@spotter/lowcode-core"
import { ModuleTypes, componentTypeMp } from "@spotter/lowcode-common"



enum InsertPos {
    Top = 'top',
    Bottom = 'bottom'
}
export const TreeTitle = ({ item, background, deleteComponent, color, showInsert }: { item: any, background: string, color: string, showInsert: boolean, deleteComponent: (key: string) => void }) => {
    const { updatePageContents, pageContents } = useStore('lowcode')
    const addComponent: (insertType: ModuleTypes, insertPos: InsertPos, targetKey: string) => void = (insertType, insertPos, targetKey) => {
        const clonePageContent = cloneDeep(pageContents)
        const { targetNode, targetNodeParent } = searchNodes(clonePageContent?.data?.[0], targetKey)
        let insertIndex = 0
        targetNodeParent.children.forEach((child, index) => {
            if (child.key === targetNode.key) {
                insertIndex = index
            }
        })
        const defaultModule = globalModuleManager.getModule(insertType)?.genDefaultConfigModel(pageContents.data.length);
        if (insertPos === InsertPos.Top) {
            targetNodeParent.children.splice(insertIndex, 0, defaultModule as any)
        } else {
            targetNodeParent.children.splice(insertIndex + 1, 0, defaultModule as any)
        }
        updatePageContents(clonePageContent.data)
    }
    const items: any[] = [
        {
            key: '2',
            label: '插入',
            children: [
                {
                    key: '2-1',
                    label: '组件前插入',
                    children: [
                        {
                            key: '2-1-1',
                            label: <div onClick={() => {
                                addComponent(ModuleTypes.Button, InsertPos.Top, item.key)
                            }}>按钮</div>
                        },
                        {
                            key: '2-1-2',
                            label: <div onClick={() => {
                                addComponent(ModuleTypes.SPT_TABLE, InsertPos.Top, item.key)
                            }}>表格</div>
                        },
                        {
                            key: '2-1-3',
                            label: <div onClick={() => {
                                addComponent(ModuleTypes.PageContainer, InsertPos.Top, item.key)
                            }}>页面</div>
                        }
                    ]
                },
                {
                    key: '2-2',
                    label: '组件后插入',
                    children: [
                        {
                            key: '2-2-1',
                            label: <div onClick={() => {
                                addComponent(ModuleTypes.Button, InsertPos.Bottom, item.key)
                            }}>按钮</div>
                        },
                        {
                            key: '2-2-2',
                            label: <div onClick={() => {
                                addComponent(ModuleTypes.SPT_TABLE, InsertPos.Bottom, item.key)
                            }}>表格</div>
                        },
                        {
                            key: '2-2-3',
                            label: <div onClick={() => {
                                addComponent(ModuleTypes.PageContainer, InsertPos.Bottom, item.key)
                            }}>页面</div>
                        }
                    ]
                },
            ],
        },

    ];
    return <div className='flex'>
        {showInsert && <Dropdown menu={{ items }}>
            <div className='flex items-center ' style={{
                background: background,
                color: color,
                borderRight: 'solid 1px white'
            }}><HolderOutlined /></div>
        </Dropdown>

        }
        <div className='flex flex-1'>
            <div
                style={{
                    flexGrow: 1,
                    minHeight: '32px',
                    background: background,
                    color: color,
                    display: 'flex',
                    flexWrap: 'nowrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 12px 0 12px',
                    width: '100%',
                }}>
                <div>{`${componentTypeMp[item.componentType as keyof typeof componentTypeMp]}-${item.key.split('_')[1]}`}</div>
                <Popconfirm
                    title={
                        <div style={{ width: '206px' }}>
                            确定删除该组件吗？
                        </div>
                    }
                    onConfirm={() => {
                        deleteComponent(item.key)
                    }}
                    okText={'确定'}
                    cancelText={'取消'}
                >
                    <div className='ml-4px'><DeleteOutlined /></div>
                </Popconfirm>
            </div>
        </div>
    </div>
}