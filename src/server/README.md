# server 模块

server 用于提供后端接口服务，在request中提供了对于axios的基本封装与request/response的响应拦截，方便开发者快速开发后端接口服务。

## 开发规范

在server/api/ 下擦黄建对应页面的api文件,请求模块的使用规范为:

```typescript
export const getOrderDetail = () => $request({ url: '/<your-api-path>', method: 'GET' })
```

其中 `<your-api-path>` 为具体的接口路径，例如 `/orders/detail`。
