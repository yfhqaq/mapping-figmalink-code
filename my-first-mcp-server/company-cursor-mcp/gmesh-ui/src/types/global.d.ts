declare module '*.svg' {
    const path: string;
    export default path;
}
declare module '*.png' {
    const path: string;
    export default path;
}

declare module '*.bmp' {
    const path: string;
    export default path;
}

declare module '*.gif' {
    const path: string;
    export default path;
}

declare module '*.jpg' {
    const path: string;
    export default path;
}

declare module '*.jpeg' {
    const path: string;
    export default path;
}

declare module 'pagedjs';

declare namespace JSX {
    interface IntrinsicElements {
        'tableau-viz': any; // 该类型根据全局组件的结构来定义
        'viz-filter': any;
    }
}

interface Window {
    __SPOTTER_FE_CONFIG_API__?: {
        tableConfig: {
            get: (key: string) => Promise<{ success: boolean; data?: any }>;
            set: (key: string, data: any) => void;
            singleGet: (key: string) => Promise<{ success: boolean; data?: any }>;
            singleSet: (key: string, value: any) => Promise<{ success: boolean }>;
        };
    };
    [otherKey: string]: any;
}
