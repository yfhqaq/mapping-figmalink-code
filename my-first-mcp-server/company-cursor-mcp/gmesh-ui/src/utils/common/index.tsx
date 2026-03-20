/**
 * 防抖函数
 * @param func 回调函数
 * @param wait 延迟时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number,
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function (this: any, ...args: Parameters<T>): void {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            func.apply(this, args);
            timeoutId = null;
        }, wait);
    };
}

/**
 * 检查给定的对象是否为非空对象
 * @param obj - 要检查的对象
 * @returns 如果对象为非空则返回true，否则返回false
 */
export function isNonEmptyObject(obj: any): boolean {
    return obj !== null && typeof obj === 'object' && Object.getOwnPropertyNames(obj).length > 0;
}
