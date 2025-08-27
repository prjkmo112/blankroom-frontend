FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html

ENV REST_API_URL=http://localhost:3000

COPY --from=build /app/dist /usr/share/nginx/html

RUN <<'CONFIGJS' cat > /usr/share/nginx/html/config.template.js
window.APP_CONFIG = {
  REST_API_URL: "${REST_API_URL}"
};
CONFIGJS

RUN <<'EOF' cat > /docker-entrypoint.d/10-config.sh
#!/bin/sh
set -e
export REST_API_URL
envsubst < /usr/share/nginx/html/config.template.js > /usr/share/nginx/html/config.js
EOF
RUN chmod 755 /docker-entrypoint.d/10-config.sh

RUN <<'NGINXCONF' cat > /etc/nginx/conf.d/default.conf
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  # config.js는 매 실행별 값이 달라질 수 있으니 캐시 금지
  location = /config.js {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    try_files $uri =404;
  }

  # 정적 리소스 캐싱
  location ~* \.(?:js|mjs|css|png|jpg|jpeg|gif|ico|svg|webp|woff2?)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    try_files $uri =404;
  }

  # SPA 히스토리 모드 지원
  location / {
    try_files $uri $uri/ /index.html;
  }
}
NGINXCONF

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]