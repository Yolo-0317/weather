import axios from "axios";
import dayjs from "dayjs";

// 创建 axios 实例
const request = axios.create({
  baseURL: "https://n23wry46u3.re.qweatherapi.com", // 基础 URL
  timeout: 5000, // 请求超时时间
});

function refreshToken() {
  const jwtTokenExp = Number(localStorage.getItem("jwtTokenExp"));
  const jwtToken = localStorage.getItem("jwtToken");
  const nowSecond = dayjs().unix();
  if (!jwtToken || !jwtTokenExp || nowSecond >= jwtTokenExp) {
    request({
      url: "http://localhost:3001/login",
    }).then((res) => {
      if (res.data.token) {
        localStorage.setItem("jwtToken", res.data.token);
        localStorage.setItem("jwtTokenExp", res.data.expire);
        window.location.reload();
      }
    });
  }
}

request.interceptors.request.use(
  (config) => {
    // 在发送请求配置JWT
    const token = localStorage.getItem("jwtToken");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 401:
          console.error("未授权，请重新登录");
          refreshToken();
          // 可以跳转到登录页面
          break;
        case 403:
          console.error("拒绝访问");
          break;
        case 404:
          console.error("请求地址不存在");
          break;
        default:
          console.error("服务器错误");
      }
    } else {
      console.error("网络连接异常");
    }
    return Promise.reject(error);
  }
);

export default request;
