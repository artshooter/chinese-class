# 使用轻量级 Nginx Alpine 镜像
FROM nginx:alpine

# 复制构建输出到 Nginx 默认目录
COPY dist/ /usr/share/nginx/html/

# 创建自定义 Nginx 配置（支持 SPA 路由）
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 7d; \
        add_header Cache-Control "public"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# 暴露端口（仅用于容器内部）
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
