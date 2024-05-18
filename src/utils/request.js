import axios from "axios";


const baseUrl = 'http://errorserver.top:5005'
//const baseUrl = 'http://10.7.62.164:8080'


const request = axios.create({
    timeout: 1000
});

// 请求拦截器
request.interceptors.request.use(config => {
    if (process.env.NODE_ENV === 'production' && config.url.startsWith('/api')) {   //打包后生效
        config.url = baseUrl + config.url.replace(/^\/api/,'');
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default request

