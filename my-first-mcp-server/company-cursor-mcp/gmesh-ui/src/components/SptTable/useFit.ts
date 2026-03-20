import { useEffect, useMemo, useState } from 'react';
import type { SptTableProps } from './index';

enum SPOTTER_TABLE_FIT_CLASS {
    CONTAINER = 'spotter-table-fit-container',
    CONTENT = 'spotter-table-fit-content',
    NONE = 'spotter-table-fit-none',
}

const getScrollY = (fitMode: SptTableProps['fit']) =>
    (fitMode === 'auto' && (window.innerHeight as number) > 1080) || fitMode === 'container'
        ? '100%'
        : undefined;

export const useFit = (fitMode: SptTableProps<any, any>['fit']) => {
    // y 轴滚动设置
    const [scrollY, setScrollY] = useState(
        // 初始化时检测高度
        getScrollY(fitMode),
    );

    const fitClass = useMemo(() => {
        switch (fitMode) {
            case 'auto': {
                return (window.innerHeight as number) > 1080
                    ? SPOTTER_TABLE_FIT_CLASS.CONTAINER
                    : SPOTTER_TABLE_FIT_CLASS.CONTENT;
            }
            case 'content': {
                return SPOTTER_TABLE_FIT_CLASS.CONTENT;
            }
            case 'container': {
                return SPOTTER_TABLE_FIT_CLASS.CONTAINER;
            }
            case 'none': {
                return SPOTTER_TABLE_FIT_CLASS.NONE;
            }
            default: {
                return SPOTTER_TABLE_FIT_CLASS.CONTENT;
            }
        }
    }, [scrollY, fitMode]);

    useEffect(() => {
        const resizeHandler = () => {
            setScrollY(getScrollY(fitMode));
        };
        window.addEventListener('resize', resizeHandler);
        return () => window.removeEventListener('resize', resizeHandler);
    }, []);

    return {
        scrollY,
        fitClass,
    };
};
