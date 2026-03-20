import { ModuleModel } from "@spotter/lowcode-common"
import { cloneDeep } from "lodash"
export const searchNodes = (source: ModuleModel, targetKey: string) => {
    let targetNode: ModuleModel = {} as any;
    let targetNodeParent: ModuleModel = {} as any
    const fn = (parent: ModuleModel, origin: ModuleModel, key: string) => {
        if (origin?.key === key) {
            targetNodeParent = parent
            targetNode = origin
            return
        }
        if (origin.children && origin.children.length > 0) {
            origin.children.forEach((item) => {
                fn(origin, item, key)
            })
        }
    }
    fn(source, source, targetKey)
    return {
        targetNode, targetNodeParent
    }
}
export const swapNodePositions: (dragNode: any, stopNode: any, sourceContent: any) => any = (dragNode, stopNode, sourceContent) => {
    //可通过stopNode.pos属性快速定位节点位置
    //不允许节点拖拽为自己的字节点
    //分为三种情况：1.子级节点拖拽到父节点第一个字节点位置：stopNode.dragOverGapBottom：false,stopNode.dragOverGapTop:false,stopNode.dragOver:true。
    //2.同级别拽动 ，未拽动到同级节点父节点第一个位置，则停止位置在stopNode上方：stopNode.dragOverGapBottom：false,stopNode.dragOverGapTop:true,stopNode.dragOver:false
    //高级别节点拽动到低级别节点位置：依旧是分为上面两种情况处理
    const clonePageContents = cloneDeep(sourceContent)

    //停止节点引用地址及其父节点引用地址
    let { targetNodeParent } = searchNodes(clonePageContents.data[0] as any, stopNode.key)
    //拖拽节点及其父节点
    const { targetNode: moveNode, targetNodeParent: moveNodeParent } = searchNodes(clonePageContents.data[0] as any, dragNode?.key)
    let sameParentFlag = false
    if (moveNodeParent === targetNodeParent) {
        sameParentFlag = true
    }
    const stopIndex = Number(stopNode.pos.split('-')?.pop() ?? 1)
    let insertIndex = stopIndex
    // 在父节点第一个子节点位置
    if (!stopNode.dragOverGapBottom && !stopNode.dragOverGapTop && stopNode.dragOver) {
        insertIndex = 0
        targetNodeParent.children.unshift(moveNode)
    }
    //在目标节点上方
    if (!stopNode.dragOverGapBottom && stopNode.dragOverGapTop && !stopNode.dragOver) {
        insertIndex = stopIndex - 1
        targetNodeParent.children.splice(stopIndex, 0, moveNode)
    }
    //在目标节点下方
    if (!stopNode.dragOverGapTop && !stopNode.dragOver) {
        insertIndex = stopIndex + 1
        targetNodeParent.children = [...targetNodeParent.children.slice(0, stopIndex + 1), moveNode, ...targetNodeParent.children.slice(stopIndex + 1)]
    }
    if (sameParentFlag) {
        moveNodeParent.children = moveNodeParent.children.filter((value, index) => {
            if (value.key === moveNode.key) {
                if (index === insertIndex) {
                    return value
                } else {
                    return undefined
                }
            }
            return value
        })
    } else {
        moveNodeParent.children = moveNodeParent.children?.filter((item) => item.key !== moveNode.key)
    }
    return clonePageContents
}

export const addtoChildren: (dragNode: any, stopNode: any, sourceContent: any) => any = (dragNode, stopNode, sourceContent) => {
    const clonePageContents = cloneDeep(sourceContent)
    //停止节点引用地址及其父节点引用地址
    const { targetNode } = searchNodes(clonePageContents.data[0] as any, stopNode.key)
    //拖拽节点及其父节点
    const { targetNode: moveNode, targetNodeParent: moveNodeParent } = searchNodes(clonePageContents.data[0] as any, dragNode?.key)
    moveNodeParent.children = moveNodeParent.children.filter((child) => {
        return child.key !== moveNode.key
    })
    targetNode.children = [moveNode, ...(targetNode.children ?? [])]
    return clonePageContents
}
export const deleteComponent = (pageContentData: ModuleModel[], deleteKey: string) => {
    const clonePageContentsData = cloneDeep(pageContentData)
    const { targetNodeParent } = searchNodes(clonePageContentsData?.[0], deleteKey)
    targetNodeParent.children = targetNodeParent.children.filter((child) => {
        return child.key !== deleteKey
    })
    return clonePageContentsData
}
