# 部署说明

## Vercel 部署配置

### 问题
- 前端部署在 Vercel (HTTPS)
- 后端部署在自己的服务器 (HTTP)
- 浏览器会阻止 HTTPS 页面访问 HTTP 接口（Mixed Content 问题）

### 解决方案

#### 方案 1：使用 Vercel 代理（当前方案）✅

**配置文件：`vercel.json`**
```json
{
  "rewrites": [
    {
      "source": "/api/v1/:path*",
      "destination": "http://8.130.113.61:3000/api/v1/:path*"
    }
  ]
}
```

**工作原理：**
1. 前端在生产环境使用相对路径 `/api/v1`
2. Vercel 将这些请求代理到你的 HTTP 后端
3. 浏览器只看到 HTTPS 请求，不会报错

**优点：**
- 简单快速
- 不需要修改后端
- 不需要 SSL 证书

**缺点：**
- 每次请求都经过 Vercel 服务器，可能稍慢

---

#### 方案 2：在服务器上配置 HTTPS（推荐长期方案）

由于你的服务器有 1Panel 和 OpenResty，可以配置反向代理和 SSL：

**步骤：**

1. **在 1Panel 中申请免费 SSL 证书**
   - 使用 Let's Encrypt
   - 为你的域名申请证书

2. **配置 OpenResty/Nginx 反向代理**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name api.yourdomain.com;

       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;

       location /api/v1/ {
           proxy_pass http://localhost:3000/api/v1/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **修改前端配置**
   ```typescript
   // src/__prod__/index.ts
   export const PROD_HOST = 'https://api.yourdomain.com/api/v1'
   ```

4. **删除 vercel.json**（不再需要代理）

**优点：**
- 性能更好（直连后端）
- 更安全（全程 HTTPS）
- 更专业

**缺点：**
- 需要域名
- 需要配置 SSL 证书
- 需要配置反向代理

---

#### 方案 3：使用 Cloudflare Tunnel（免费且简单）

如果不想配置 SSL，可以使用 Cloudflare Tunnel：

1. 安装 cloudflared
2. 创建 tunnel 连接到你的后端
3. 自动获得 HTTPS 域名
4. 修改 `PROD_HOST` 为 Cloudflare 提供的域名

---

## 当前环境配置

### 开发环境
- 直接访问后端：`http://8.130.113.61:3000/api/v1`

### 生产环境（Vercel）
- 使用相对路径：`/api/v1`
- Vercel 代理到：`http://8.130.113.61:3000/api/v1`

## 部署步骤

1. 提交代码到 Git
   ```bash
   git add .
   git commit -m "配置 Vercel 代理"
   git push
   ```

2. Vercel 会自动部署

3. 访问你的 Vercel 域名测试

## 注意事项

- ⚠️ 如果后端 IP 或端口变化，需要更新 `vercel.json`
- ⚠️ 建议长期使用方案 2（HTTPS 后端）
- ⚠️ 确保后端允许跨域（CORS）
