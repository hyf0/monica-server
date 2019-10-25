# 简介

monica-server 是应用 [monica](https://github.com/iheyunfei/monica) 的服务端实现。

# 技术栈

- 采用 Apollo Server 的 **Graph QL** 实现
- 使用 **Typescript** 开发
- mongdoDB
- Koa2 服务器框架
- 使用 JWT 鉴权

# 使用

## 启动开发环境下的服务器

1. git clone repo_url

2. npm install

3. npm run dev

## 启动生成环境下的服务器

1. git clone repo_url

2. npm install

3. npm run build

4. npx pm2 start ./dist/index.js --name monica-server

## 注意

- 除了必须的拉取代码和安装依赖，你必须要在自备一个 mongdoDB 数据库，无论是本地还是远程的，然后在 src/serverConfig.ts 里更改对应的数据库连接地址。

- 前端 gql 请求的地址是 /graphql 而非根目录 /。

- 开发环境下的数据库密码和 JWT 密匙需要通过环境变量提供，具体见 src/serverConfig.ts
