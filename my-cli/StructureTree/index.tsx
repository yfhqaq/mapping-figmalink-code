import { useStore } from "@client/app/store"
import { ModuleModel } from "@spotter/lowcode-common";
import { Tree } from 'antd';
import { observer } from "mobx-react-lite";

import { addtoChildren, deleteComponent, searchNodes, swapNodePositions } from "./utils";
import { TreeTitle } from "./TreeTitle";




export const StructureTree = observer(() => {
  const { updatePageContents, pageContents, updateCurrentSelectKey, curSelectModuleKey } = useStore('lowcode')
  const onDrop: (dropInfo: any) => void = (dropInfo: any) => {
    //dragNode:拽动的节点，stopNode:拽动的节点停止的节点,dropToGap:判断是添加为子节点还是兄弟节点·
    const { dragNode, node: stopNode, dropToGap } = dropInfo
    let newPageContent = pageContents
    if (dropToGap) {
      //添加为兄弟节点
      if (stopNode.pos === "0-0") {
        //根节点只允许有一个
        return
      }
      newPageContent = swapNodePositions(dragNode, stopNode, pageContents)
    } else {
      newPageContent = addtoChildren(dragNode, stopNode, pageContents)
    }

    updatePageContents(newPageContent.data)
  }
  const deleteModule = (key: string) => {
    const deletedPageContentsData = deleteComponent(pageContents.data, key)
    updatePageContents(deletedPageContentsData)
    updateCurrentSelectKey('', '')
  }

  const loop = (data: ModuleModel[]) => {
    const treeNode = data.map(item => {
      if (item.children && item.children.length) {
        return (
          <Tree.TreeNode key={item.key}
            title={<span onClick={() => {
              const { targetNode, targetNodeParent } = searchNodes(pageContents?.data?.[0], item.key)
              updateCurrentSelectKey(targetNode.key, targetNodeParent.key)
            }}><TreeTitle
              deleteComponent={deleteModule}
              item={item}
              showInsert={curSelectModuleKey.data === item.key}
              color={curSelectModuleKey.data === item.key ? 'rgb(196,30,127)' : 'rgb(30,57,195)'}
              background={curSelectModuleKey.data === item.key ? 'rgba(254,241,246)' : 'rgba(240,245,255)'}
            ></TreeTitle><div></div></span>}
          >
            {loop(item.children)}
          </Tree.TreeNode>
        );
      }
      return <Tree.TreeNode key={item.key}
        title={<span onClick={() => {
          const { targetNode, targetNodeParent } = searchNodes(pageContents?.data?.[0], item.key)
          updateCurrentSelectKey(targetNode.key, targetNodeParent.key)
        }}><TreeTitle deleteComponent={deleteModule}
          item={item}
          showInsert={curSelectModuleKey.data === item.key}
          color={curSelectModuleKey.data === item.key ? 'rgb(196,30,127)' : 'rgb(30,57,195)'}
          background={curSelectModuleKey.data === item.key ? 'rgba(254,241,246)' : 'rgba(240,245,255)'}
        ></TreeTitle></span>}
      />;
    });
    return treeNode
  }

  return <Tree draggable blockNode
    showLine
    onDrop={onDrop}
  >
    {loop(pageContents.data ?? [])}
  </Tree>
})
