import React, { createContext, FC, ReactNode, useContext, useEffect, useReducer } from 'react';
import { SortableItemType, SortableListType } from './typing';

type ActionType = 'add' | 'batchAdd' | 'hide' | 'batchHide' | 'update' | 'clear' | 'reset';
interface Action {
    type: ActionType;
    data?: SortableItemType['dataIndex'] | SortableItemType | SortableItemType[];
}

const SortableListContext = createContext<SortableItemType[]>([]);
const SortableListDispatchContext = createContext<React.Dispatch<Action> | null>(null);

export const SortableListProvider: FC<{
    initialSortableList: SortableListType;
    children: ReactNode;
}> = ({ initialSortableList, children }) => {
    const sortableListReducer = (list: SortableListType, action: Action): SortableListType => {
        const listKeys = list.map((item) => item.dataIndex);
        const { type, data } = action;
        if (type === 'add' || type === 'batchAdd') {
            // 单次添加时，查重
            if (type === 'add' && listKeys.includes(data)) {
                return list;
            }
            const fixedRightList = list.filter((item) => item.fixed === 'right');
            let withoutFixedRightList = list.filter((item) => item.fixed !== 'right');

            if (type === 'add') {
                withoutFixedRightList.push(data);
            } else {
                // 批量添加时，去重复
                const batchAddList = (data as SortableItemType[]).filter(
                    (item) => !listKeys.includes(item.dataIndex),
                );

                withoutFixedRightList = withoutFixedRightList.concat(batchAddList);
            }
            return [...withoutFixedRightList, ...fixedRightList];
        } else if (type === 'hide' || type === 'batchHide') {
            if (type === 'batchHide') {
                // 批量隐藏时，过滤掉不可隐藏项
                const hideKeys = (data as SortableItemType[])
                    .filter((item) => !item.disableChecked)
                    .map((item: SortableItemType) => item.dataIndex);
                return [...list.filter((item) => !hideKeys.includes(item.dataIndex))];
            }
            return [...list.filter((item) => item.dataIndex !== data)];
        } else if (type === 'update') {
            return [...data];
        } else if (type === 'clear') {
            return [...list.filter((item) => item.disableChecked || item.fixed)];
        } else if (type === 'reset') {
            return [...initialSortableList];
        }
        return list;
    };
    const [sortableList, dispatch] = useReducer(sortableListReducer, initialSortableList);
    useEffect(() => {
        dispatch({ type: 'reset' });
    }, [initialSortableList]);

    return (
        <SortableListContext.Provider value={sortableList}>
            <SortableListDispatchContext.Provider value={dispatch}>
                {children}
            </SortableListDispatchContext.Provider>
        </SortableListContext.Provider>
    );
};
export const useSortableList = () => useContext(SortableListContext);
export const useSortableListDispatch = () => useContext(SortableListDispatchContext);
