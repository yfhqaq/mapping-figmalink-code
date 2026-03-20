import React from 'react';
import { useEffect } from 'react';
import { EmbeddedRenderer, NavigationRenderType } from './renderer';

const SUPPORT_EMBEDDED_TYPE = new Set(['bi-embedded']);
const parseData = (data: any) => {
    try {
        return {
            ...data,
            jsonData: JSON.parse(data?.data),
        };
    } catch (error) {
        console.error(error);
        return null;
    }
};
const processMenus = (menus: any): any[] => {
    const result = [];
    for (const menu of menus) {
        const parsedMenu = parseData(menu);
        if (parsedMenu) {
            result.push(parsedMenu);
        }
        if (menu?.children) {
            const parsedChildren = processMenus(menu.children);
            result.push(...parsedChildren);
        }
    }
    return result;
};

export const useEmbeddedRoutes = (menus: any, spotterRouter: any) => {
    useEffect(() => {
        const processMenusData = processMenus(menus?.data);
        spotterRouter.addLayoutRoute({
            children: processMenusData
                .filter((i) =>
                    SUPPORT_EMBEDDED_TYPE.has(i.jsonData.renderType as NavigationRenderType),
                )
                .map((i) => ({
                    path: i.jsonData.url,
                    i18nKey: i.jsonData.name,
                    element: (
                        <EmbeddedRenderer
                            key={i.jsonData.url}
                            data={i.jsonData ?? {}}
                            type={i.jsonData.biDatasource}
                        />
                    ),
                })),
        });
    }, [menus?.data]);
};

export const BiEmbeddedRenderer = EmbeddedRenderer;
export type BiNavigationRenderType = NavigationRenderType;
export { BiEmbedded } from './renderer/BiEmbedded';
