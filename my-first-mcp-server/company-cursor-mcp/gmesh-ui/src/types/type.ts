import { Dayjs } from 'dayjs';
import { Dispatch, HTMLAttributeAnchorTarget, ReactNode, SetStateAction } from 'react';

export function tuple<T extends string[] | number[]>(...args: T): T;
export function tuple(...args: any) {
    return args;
}
export type ActionType<State> = Dispatch<SetStateAction<State>>;
export type UpdateFnPropsType<State> = State | ((origin: State) => State);
export type UpdateFnType<State> = (props: UpdateFnPropsType<State>) => void;
export type ComposeEnum<K extends keyof any> = {
    [P in K]: P;
};

export type IdentifierType = number | string;
export interface BreadcrumbProps {
    name: string;
    url: string;
}

export interface Department {
    id: string;
    parentId: string | number;
    entId: string;
    name: string;
    code: string;
    description: string | null;
    rank: number;
    status: number;
    creationTime: string;
    modificationTime: string;
    outAssist?: boolean;
    children?: Department[];
}

export interface TableParametersCommon {
    pageNo: number;
    pageSize: number;
}

export interface SpotterRouteObject<T extends string> {
    caseSensitive?: boolean;
    children?: SpotterRouteObject<T>[];
    // 只有存在 element ，在面包屑中展示时才会表现为链接
    element?: ReactNode;
    index?: boolean;
    path?: string;
    // route object 的唯一值，可以使用 navigation[key] 来快速访问指定的 route object
    key: T;
    // 在菜单和面包屑时渲染使用
    icon?: ReactNode;

    // 是否会注册为菜单（不包含 group，必须拥有真实路径的菜单），如果路由不会注册为菜单，那么该对象的 path 的前缀必须可以匹配属于已有的菜单路径之一，否则将没有菜单被选中
    isMenu?: boolean;
    // 如果没有 name 则不会展示在面包屑里
    name?: string;
    target?: HTMLAttributeAnchorTarget;
}

export type RangeValue = [Dayjs | null, Dayjs | null] | null;
