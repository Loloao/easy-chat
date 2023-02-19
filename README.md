# easy-chat

本项目是 easy-chat 的服务器部分，使用 nodejs 以及 mongoDB 搭建，部署在[Render](https://dashboard.render.com/)。

目前只有 PC 前端，未来准备上线多端。

* [PC 端网站](https://easy-chat-xvos.onrender.com)

* [PC 前端项目代码地址](https://github.com/Loloao/easy-chat-pc)

## Setup

* 新建 .env 文件，配置以下内容
  + PORT：访问的端口号
  + MONGO_URI: MongoDB 数据库连接地址
  + JWT_TOKEN: 用于设置 JWT 的秘钥
  + CLIENT_ADDRESS: 客户端地址

* 安装依赖`npm install`

* 运行`npm run dev`之后项目将能在 `localhost:8000` 访问

* 注册并登录之后就能和任意人员进行对话

## Todos

* [ ] 不能创建同名 user
* [ ] 规范错误处理
* [ ] 增加单元测试
* [ ] 支持 docker
