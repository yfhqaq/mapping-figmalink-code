import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

/**
 * useLoaded
 *
 * @description 拓展useEffect，不在first render时执行
 */
export const useLoadedEffect = (fn: EffectCallback, deps: DependencyList) => {
    const isFirst = useRef(true);

    useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false;
            return;
        }

        return fn();
    }, deps);
};
