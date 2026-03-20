import { AxiosResponse, AxiosRequestConfig } from 'axios';

export interface WithPagination<T = any> {
    currentPage: number;
    pageSize: number;
    totalNum: number;
    totalPage: number;
    startIndex: number;
    data: T[];
}

export interface SpotterResponseResultSchema<T = any> {
    code: number;
    data: T;
    msg: string;
}
export type ServiceResponseResult<T = any> = AxiosResponse<SpotterResponseResultSchema<T>>;

export type AsyncServiceResponseResult<T = any> = Promise<ServiceResponseResult<T>>;

export type ApiPaginationReturnType<
    F extends (...args: any[]) => AsyncServiceResponseResult<WithPagination>,
> = ReturnType<F> extends AsyncServiceResponseResult<WithPagination<infer P>> ? P : never;
export type ApiReturnType<F extends (...args: any[]) => AsyncServiceResponseResult> =
    ReturnType<F> extends AsyncServiceResponseResult<infer P> ? P : never;

export type HttpClientRequestConfig<T = any> = AxiosRequestConfig<T> & {
    ignoreError?: boolean;
};
