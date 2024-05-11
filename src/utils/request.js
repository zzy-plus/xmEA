import axios from "axios";
import {baseUrl} from "@/config";

const request = axios.create({
    timeout: 1000
});

// 请求拦截器
request.interceptors.request.use(config => {
    if (process.env.NODE_ENV === 'production' && config.url.startsWith('/api')) {
        config.url = baseUrl + config.url.replace(/^\/api/,'');
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default request

