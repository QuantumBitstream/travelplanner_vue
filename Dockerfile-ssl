# 构建阶段
FROM node:16-alpine AS build

# 设置 Docker 容器中后续命令执行的“工作目录”（当前目录），意思是在镜像内建立（如果不存在则新建）/app 目录，并且把接下来所有 RUN、CMD、ENTRYPOINT、COPY、ADD 等指令的默认目录位置都切换到 以 /app 作为当前路径。
# 如果 /app 目录不存在，会自动创建。
# 常用于 Node、Python、Java 项目，将源码、依赖等文件都复制到 /app 目录，便于统一管理和运行命令。
# 在 Dockerfile 中，WORKDIR 之后的指令都将以这个目录为基础
# 设置构建阶段工作目录
WORKDIR /app

# 以下指令都在 /app 目录执行
# 先复制依赖定义文件
# 安装依赖
COPY package*.json ./
RUN npm install

# 构建应用
# 复制源代码
# 复制当前目录到 /app
COPY . .
# 在 /app 目录运行 npm install
# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建文件
# NGINX 部署静态文件
COPY --from=build /app/dist /usr/share/nginx/html

# 复制自定义 Nginx 配置
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# 声明容器内应用运行的端口, 告诉用户或别的容器，这个容器的应用程序会在该端口提供服务
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
