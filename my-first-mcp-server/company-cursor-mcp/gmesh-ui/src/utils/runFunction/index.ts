/**
 * Executes a function if the value is a function, otherwise returns the value itself.
 * @param valueEnum - The value to be checked and executed if it is a function.
 * @param rest - Additional arguments to be passed to the function.
 * @returns The result of the function execution or the original value.
 */
export function runFunction<T extends any[]>(valueEnum: any, ...rest: T) {
    if (typeof valueEnum === 'function') {
        return valueEnum(...rest);
    }
    return valueEnum;
}
