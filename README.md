# Weather

- 显示上海未来七天内的温度和天气，React + TypeScript + Vite
- 支持输入搜索并切换城市

## 应用启动

### 开发环境

- npm install
- npm start

## 天气api

和风天气API: <https://dev.qweather.com/>

## Node服务

src/server/index.js

### 生成jwt

<https://dev.qweather.com/docs/authentication/jwt/#jwt-demo>

- 接口：/login
- 返回："{"token": "", expire: ""}"

### 代理geo接口

- 接口: /geo/city/lookup
- 前端直接访问和风天气的geo api有跨域问题，通过node服务进行转发
