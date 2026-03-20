import { localCache } from '@spotter/app-client-toolkit';
import React from 'react';
import { FC, ReactNode, useMemo } from 'react';

/**
 * 本地存储权限code的key
 */
export const LOCAL_PERMISSION_CODE_KEY = Symbol('PERMISSION_CODE_DATA').toString();

export interface SptAuthProps {
    /**
     * 权限 code
     */
    code: string;
    /**
     * 无权限时的显示，默认无权限不显示任何内容
     */
    fallback?: ReactNode;
    children?: ReactNode;
}

/**
 * SptAuth 权限组件，根据传入的权限 code 判断，来控制元素的显示和隐藏。
 */
const SptAuth: FC<SptAuthProps> = ({ code, fallback, children }) => {
    const localPermissionCodeData = localCache.get(LOCAL_PERMISSION_CODE_KEY);
    const hasPermission = useMemo(
        () => localPermissionCodeData?.includes(code),
        [localPermissionCodeData, code],
    );
    return hasPermission ? (
        <React.Fragment>{children}</React.Fragment>
    ) : fallback ? (
        <React.Fragment>{fallback}</React.Fragment>
    ) : null;
};

export default SptAuth;
