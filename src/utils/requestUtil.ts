import Axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const HTTP_METHODS = ['get', 'post', 'put', 'patch', 'delete'];

//We can send custom headers like auth token
interface CustomHeaders {
    'Content-Type': string;
    Authorization?: string;
    [key: string]: any;
}

export const RequestUtil = async <T = any>(
    baseUrl: string,
    {
        method = 'get',
        data,
        headers = {},
        params = {}
    }: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
    try {
        const customHeaders: CustomHeaders = {
            'Content-Type': 'application/json',
            ...headers
        };

        const requestOptions: AxiosRequestConfig = {
            url: baseUrl,
            method,
            headers: customHeaders,
            params,
            data
        };

        if (!HTTP_METHODS.includes(method)) {
            throw new Error('Invalid Method');
        }

        const response = await Axios.request<T>(requestOptions);
        return response;
    } catch (error: any) {
        console.error('Request Error:', {
            url: baseUrl,
            error: error.message || error
        });
        throw new Error('Error making request');
    }
};