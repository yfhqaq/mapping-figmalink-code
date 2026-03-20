import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios';
import JSONBigInt from 'json-bigint';
import { HttpClientRequestConfig } from './type';

export const JSONBig2String = JSONBigInt({ storeAsString: true, constructorAction: 'preserve', protoAction: 'preserve' });
const defaultStatusSetMap = {
    authError: new Set([401, 4010000, 4010001, 4010002, 4010003]),
    permissionError: new Set([403]),
    success: new Set([200, 201]),
};

type OmittedAxiosOptions =
    | 'url'
    | 'method'
    | 'baseURL'
    | 'data'
    | 'params'
    | 'paramsSerializer'
    | 'transformResponse'
    | 'transformRequest'
    | 'withCredentials';

export interface HttpClientOptions<D = any> {
    context: URL;
    res: {
        isSuccess?: (response: AxiosResponse) => boolean;
        isAuthError?: (response: AxiosResponse) => boolean;
        isPermissionError?: (response: AxiosResponse) => boolean;
        onAuthError?: (error: any) => void;
        onPermissionError?: (error: any) => void;
        onOtherError?: (error: any) => void;
    };
    axiosOptions?: Omit<AxiosRequestConfig<D>, OmittedAxiosOptions>;
}

export default class HttpClient {
    private readonly httpClient: AxiosInstance;
    private options: Required<HttpClientOptions>;
    constructor(options: HttpClientOptions) {
        this.options = options as Required<HttpClientOptions>;
        this.options.res.isSuccess =
        options.res?.isSuccess ?? ((res) => defaultStatusSetMap.success.has(res.status) && defaultStatusSetMap.success.has(res.data?.code));
        this.options.res.isAuthError = options.res?.isAuthError ?? ((res) => defaultStatusSetMap.authError.has(res.status) || defaultStatusSetMap.authError.has(res.data?.code));
        this.options.res.isPermissionError = options.res?.isPermissionError ?? ((res) => defaultStatusSetMap.permissionError.has(res.status) || defaultStatusSetMap.permissionError.has(res.data?.code));
        this.httpClient = axios.create({
            ...this.options.axiosOptions,
            baseURL: this.options.context.href,
            withCredentials: true, // CORS with cookies,
            transformResponse: [(data) => {
                try {
                    return JSONBig2String.parse(data || "{}");
                } catch (error) {
                    console.error(error);
                    return data;
                }
            }],
        });

        this.httpClient.interceptors.request.use(
            (config) => {
                if (!config.data) {
                    config.data = {};
                }
                return config;
            },
            (error) => {
                console.log('request', error);
                return Promise.reject(error);
            },
        );

        // 响应拦截器
        this.httpClient.interceptors.response.use(
            (response) => {
                if (this.options.res.isSuccess!(response)) {
                    return Promise.resolve(response);
                }
                if (this.options.res.isAuthError!(response)) {
                    console.error(response);
                    this.options.res.onAuthError?.(response);
                } else if (this.options.res.isPermissionError!(response)) {
                    console.error(response);
                    this.options.res.onPermissionError?.(response);
                } else {
                    // @ts-ignore
                    if (response?.config?.ignoreError) {
                        return Promise.resolve(response);
                    }
                    this.options.res.onOtherError?.(response);
                    // content: error.response.data?.message || 'Network Error'
                    console.error(JSON.stringify(response.data));
                }
                return Promise.reject(response);
            },
            (error) => {
                const response = error?.response || {};
                if (this.options.res.isAuthError!(response)) {
                    console.log(error);
                    this.options.res.onAuthError?.(response);
                }  else if (this.options.res.isPermissionError!(response)) {
                    console.error(response);
                    this.options.res.onPermissionError?.(response);
                } else {
                    this.options.res.onOtherError?.(response);
                    // content: error.response.data?.message || 'Network Error'
                    console.error(JSON.stringify(error.toJSON()));
                }
                return Promise.reject(error);
            },
        );
    }

    async request<T = any>(config: HttpClientRequestConfig) {
        return this.httpClient.request<T>(config);
    }
    getAxios() {
        return this.httpClient;
    }
}