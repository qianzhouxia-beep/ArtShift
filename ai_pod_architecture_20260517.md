# AI 图片生成 + POD 定制平台 - 技术架构方案
> 任务来源：用户 Subagent 请求
> 时间：2026-05-17
> 目标：为"AI 图片生成 + 实体产品定制"海外 Web 应用提供完整技术架构方案

---

## 1. 技术栈选型（轻量，适合单人开发）

### 前端
- **框架**: Next.js 14 (App Router) + TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **状态管理**: Zustand（轻量，无 Redux 复杂性）
- **图片处理**: Canvas API / Fabric.js（前端预览设计效果）
- **理由**: Next.js 全栈能力可减少独立后端复杂度，SSR 利于 SEO（海外获客），TypeScript 减少运行时错误

### 后端
- **框架**: Next.js API Routes（BFF 模式）+ 独立 Express 服务（可选，用于 AI 推理）
- **语言**: TypeScript（前后端统一）
- **API 风格**: RESTful + tRPC（类型安全的内外通信）

### 数据库
- **主库**: PostgreSQL（关系型数据） + **Redis**（缓存 + 队列）
- **ORM**: Prisma（类型安全，迁移方便）
- **理由**: SQL 适合订单/用户关系数据；MongoDB 也可但 Prisma + Postgres 生态更成熟

### AI 推理
- **方案**: 调用第三方 API（初期）+ 自部署 Stable Diffusion（后期降本）
- **推荐**: Replicate API（托管 SDXL，按使用量付费，无需自管 GPU）

### 部署
- **平台**: 已有 Linux 服务器
- **容器化**: Docker + Docker Compose（简化部署）
- **反向代理**: Nginx
- **HTTPS**: Let's Encrypt（免费证书）
- **CI/CD**: GitHub Actions → 服务器拉取部署

### 第三方服务
- **POD**: Printful API
- **支付**: Stripe Checkout
- **图片存储**: Cloudinary（CDN + 图片处理）或 AWS S3
- **邮件**: Resend 或 SendGrid

---

## 2. 系统架构图（文字描述）

```
┌─────────────────────────────────────────────────────────────┐
│                        用户浏览器                            │
│  (Next.js 前端 - 设计师画布 + 产品预览 + 订单结算)           │
└──────────────┬──────────────────────────┬──────────────────┘
               │                          │
               │ API 请求                 │ Webhook 回调
               ▼                          ▼
┌──────────────────────────────┐  ┌──────────────────────┐
│    Next.js API Routes        │  │   Printful Webhook   │
│  /api/design/*               │  │   (订单状态同步)      │
│  /api/orders/*               │  └──────────┬───────────┘
│  /api/ai/generate            │             │
└──────────────┬───────────────┘             │
               │                             │
               ▼                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      后端服务层                              │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────┐  │
│  │ AI Service   │  │ Order Service│  │  Payment Service │  │
│  │ (Replicate/  │  │ (Printful    │  │  (Stripe)        │  │
│  │  SDXL API)   │  │  API 对接)   │  │                  │  │
│  └─────────────┘  └─────────────┘  └──────────────────┘  │
└──────────────┬──────────────────────────┬──────────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────┐    ┌─────────────────────────────┐
│   PostgreSQL         │    │   Redis                      │
│   (用户/订单/设计)    │    │   (队列/缓存/Session)       │
└──────────────────────┘    └─────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────────────┐
│                      外部服务                                │
│  Replicate API │ Printful API │ Stripe API │ Cloudinary     │
└─────────────────────────────────────────────────────────────┘
```

### 数据流向
1. 用户设计 → 前端 Canvas 生成预览 → 提交订单
2. 订单创建 → Stripe 支付 → 支付成功回调
3. 支付确认 → 调用 Printful API 创建订单 → 推送至 POD 生产
4. Printful 生产状态变更 → Webhook → 更新本地订单状态 → 邮件通知用户

---

## 3. 核心 API 设计（RESTful）

### 3.1 AI 图片生成
```
POST /api/ai/generate
Body: {
  "prompt": "string",           // 用户描述
  "style": "realistic|anime",  // 风格选项
  "negative_prompt": "string",  // 不想要的元素
  "count": 4                    // 生成数量
}
Response: {
  "task_id": "string",          // 用于轮询
  "images": ["url1", "url2"]    // 生成结果（或异步返回）
}
```

### 3.2 产品设计保存
```
POST /api/designs
Body: {
  "user_id": "string",
  "product_type": "t-shirt|mug|phone_case",
  "ai_image_url": "string",
  "placement": { "x": 0, "y": 0, "scale": 1 }, // 设计位置
  "mockup_urls": ["string"]       // 产品预览图
}
Response: { "design_id": "string" }
```

### 3.3 订单创建
```
POST /api/orders
Body: {
  "design_id": "string",
  "product_type": "t-shirt",
  "variant_id": "printful_variant_id", // Printful 产品规格
  "quantity": 1,
  "shipping_address": { ... }
}
Response: {
  "order_id": "string",
  "stripe_checkout_url": "string"  // 跳转支付
}
```

### 3.4 Printful 集成（服务端调用）
```
POST /api/printful/orders (内部 API)
Body: {
  "design_id": "string",
  "printful_product_id": 123,
  "files": [{"url": "设计图URL", "type": "front_print"}],
  "recipient": { ... }
}
```

### 3.5 Webhook 回调
```
POST /api/webhooks/printful
Headers: { "X-Printful-Signature": "signature" }  // 验证签名
Body: {
  "type": "package_shipped",
  "order": { "id": "printful_order_id", "status": "shipped" }
}
→ 更新本地订单状态，触发邮件通知
```

---

## 4. 数据库设计（PostgreSQL + Prisma）

### 核心表结构

```prisma
// schema.prisma

model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  avatar      String?
  designs     Design[]
  orders      Order[]
  createdAt   DateTime @default(now())
}

model Design {
  id            String   @id @default(cuid())
  userId        String?
  user          User?    @relation(fields: [userId], references: [id])
  prompt        String   // AI 生成提示词
  aiImageUrl    String   // AI 生成原图
  placement     Json     // { x, y, scale, rotation }
  productType   String   // t-shirt | mug | phone_case
  mockupUrls    String[] // 产品预览图数组
  printfulSync  Boolean  @default(false) // 是否已同步到 Printful
  createdAt     DateTime @default(now())
  orders        Order[]
}

model Order {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  designId        String
  design          Design   @relation(fields: [designId], references: [id])
  printfulOrderId String?  // Printful 订单 ID
  status          OrderStatus @default(PENDING)
  totalAmount     Decimal
  currency        String   @default("USD")
  stripeSessionId String?  // Stripe 会话 ID
  shippingAddress Json     // 收货地址
  trackingNumber  String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

enum OrderStatus {
  PENDING    // 待支付
  PAID       // 已支付
  PRODUCTION // 生产中
  SHIPPED    // 已发货
  DELIVERED  // 已送达
  CANCELLED  // 已取消
}

model Product {
  id              String   @id @default(cuid())
  type            String   // t-shirt | mug | phone_case
  printfulId      Int      // Printful 产品 ID
  name            String
  variants        Variant[] // 规格（颜色、尺寸）
  mockupTemplates Json     // 预览模板配置
}

model Variant {
  id         String   @id @default(cuid())
  productId  String
  product    Product  @relation(fields: [productId], references: [id])
  printfulVariantId Int // Printful 规格 ID
  attributes Json     // { color: "red", size: "L" }
  price       Decimal
}
```

---

## 5. AI 图片生成方案对比与推荐

### 方案对比

| 方案 | 成本 | 质量 | 速度 | 定制性 | 推荐度 |
|------|------|------|------|--------|--------|
| **DALL-E 3 (OpenAI API)** | 高（$0.04/张） | 极高 | 快 | 低 | ⭐⭐⭐（预算充足） |
| **Stable Diffusion XL (Replicate)** | 中（$0.002-0.005/张） | 高 | 中 | 高 | ⭐⭐⭐⭐⭐（推荐） |
| **Midjourney API (第三方)** | 高 | 极高 | 慢 | 中 | ⭐⭐（不稳定） |
| **自部署 SDXL (服务器 GPU)** | 低（固定成本） | 高 | 取决于硬件 | 极高 | ⭐⭐⭐⭐（后期） |

### 推荐方案：Replicate API + SDXL
**理由**：
1. **成本可控**：按调用量付费，无闲置成本
2. **无需 GPU 管理**：Replicate 托管，自动扩缩容
3. **质量足够**：SDXL 1.0 或 SDXL Turbo 满足定制设计需求
4. **迭代灵活**：后期可切换到自部署降本

**集成示例**（Next.js API Route）：
```typescript
// pages/api/ai/generate.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Replicate from 'replicate';

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { prompt, style = 'realistic' } = req.body;

  const output = await replicate.run(
    "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
    {
      input: {
        prompt: `${prompt}, ${style} style, high quality`,
        negative_prompt: "blurry, low quality, watermark",
        num_outputs: 4,
        guidance_scale: 7.5,
      }
    }
  );

  res.status(200).json({ images: output });
}
```

---

## 6. Printful API 集成方案

### 对接流程

#### 6.1 前期准备
1. 注册 Printful 账号，申请 API Key（Store → Settings → API）
2. 在 Printful 后台配置产品模板（上传设计位置模板）
3. 配置 Webhook URL（接收订单状态变更）

#### 6.2 核心 API 调用

**获取产品列表**
```typescript
// GET https://api.printful.com/products
const products = await fetch('https://api.printful.com/products', {
  headers: { 'Authorization': `Bearer ${PRINTFUL_API_KEY}` }
});
```

**创建订单**
```typescript
// POST https://api.printful.com/orders
const order = await fetch('https://api.printful.com/orders', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${PRINTFUL_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    recipient: {
      name: "John Doe",
      address1: "123 Main St",
      city: "New York",
      country_code: "US",
      zip: "10001"
    },
    items: [{
      variant_id: 12345,  // Printful 产品规格 ID
      quantity: 1,
      files: [{
        url: "https://your-cdn.com/design.png",  // 设计图 URL
        type: "front"  // 打印位置
      }]
    }],
    external_id: "your_order_id"  // 关联本地订单
  })
});
```

**Webhook 处理**
```typescript
// pages/api/webhooks/printful.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const signature = req.headers['x-printful-signature'];
  // 验证签名（使用 Printful 提供的 webhook secret）
  
  const { type, data } = req.body;
  
  if (type === 'package_shipped') {
    await prisma.order.update({
      where: { printfulOrderId: data.order.id },
      data: { status: 'SHIPPED', trackingNumber: data.shipment.tracking_number }
    });
    // 发送发货通知邮件
  }
  
  res.status(200).json({ received: true });
}
```

---

## 7. 支付集成（Stripe）

### 集成流程

#### 7.1 前端：创建 Checkout Session
```typescript
// pages/api/checkout.ts
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { orderId, amount } = req.body;
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'Custom T-Shirt' },
        unit_amount: amount * 100,  // 美分
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/order/success?order_id=${orderId}`,
    cancel_url: `${YOUR_DOMAIN}/order/cancel`,
    metadata: { orderId }  // 关联本地订单
  });
  
  res.status(200).json({ url: session.url });
}
```

#### 7.2 后端：Webhook 确认支付
```typescript
// pages/api/webhooks/stripe.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, WEBHOOK_SECRET);
  
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.orderId;
    
    // 1. 更新订单状态为已支付
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID', stripeSessionId: session.id }
    });
    
    // 2. 调用 Printful API 创建生产订单
    await fetch(`${BASE_URL}/api/printful/orders`, {
      method: 'POST',
      body: JSON.stringify({ orderId })
    });
  }
  
  res.status(200).json({ received: true });
}
```

---

## 8. 部署方案（Linux 服务器）

### 服务器环境配置

#### 8.1 基础软件安装
```bash
# 安装 Node.js 18+ (via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# 安装 PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# 安装 Redis
sudo apt install redis-server

# 安装 Nginx
sudo apt install nginx

# 安装 Docker (可选，用于容器化部署)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

#### 8.2 Nginx 配置
```nginx
# /etc/nginx/sites-available/your-domain.com
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL 证书（Let's Encrypt）
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # 前端静态文件
    location / {
        proxy_pass http://localhost:3000;  # Next.js 端口
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # 图片 CDN 反向代理（可选）
    location /images/ {
        proxy_pass https://res.cloudinary.com/your-cloud/;
    }
}
```

#### 8.3 HTTPS 证书（Let's Encrypt）
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

#### 8.4 PM2 进程管理（替代 Gunicorn）
```bash
# 安装 PM2
npm install -g pm2

# 启动 Next.js 应用
cd /path/to/your/app
pm2 start npm --name "ai-pod-app" -- start
pm2 save
pm2 startup  # 开机自启
```

#### 8.5 GitHub Actions 自动部署
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /path/to/your/app
            git pull origin main
            npm install
            npx prisma migrate deploy
            npm run build
            pm2 restart ai-pod-app
```

---

## 9. 安全考虑

### 9.1 API Key 管理
- **环境变量**：所有密钥存储在 `.env` 文件（加入 `.gitignore`）
- **Vault 方案**（可选）：使用 HashiCorp Vault 或 AWS Secrets Manager
- **Printful/Stripe Webhook**：验证签名，防止伪造请求

```typescript
// 验证 Printful Webhook 签名
import crypto from 'crypto';

function verifyPrintfulSignature(body: string, signature: string): boolean {
  const hmac = crypto.createHmac('sha256', process.env.PRINTFUL_WEBHOOK_SECRET!);
  const calculated = hmac.update(body).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(calculated));
}
```

### 9.2 用户数据保护
- **HTTPS 强制**：Nginx 重定向 HTTP → HTTPS
- **密码加密**：使用 bcrypt 哈希存储
- **敏感数据脱敏**：日志中不记录完整信用卡号、地址
- **GDPR 合规**：提供数据导出/删除接口（针对欧盟用户）

### 9.3 支付安全
- **Stripe 托管支付**：不触碰用户信用卡信息（使用 Stripe Checkout）
- **Webhook 验证**：验证 Stripe 签名防止伪造支付成功事件
- **订单金额校验**：服务端二次确认金额，防止前端篡改

### 9.4 防滥用
- **AI 生成限流**：Redis 记录用户生成次数（如：免费用户 5 次/天）
- **Rate Limiting**：Nginx 或 express-rate-limit 限制 API 调用频率
- **图片审核**：接入 AWS Rekognition 或 Sightengine 过滤违规内容

---

## 10. 开发优先级排序（MVP → 完整版）

### Phase 1: MVP（4-6 周）
**目标**：验证核心流程可跑通
1. ✅ 基础前端（Next.js + Tailwind）
2. ✅ AI 生成接口（Replicate API）
3. ✅ 产品预览（Canvas 简单展示）
4. ✅ Printful 沙盒环境对接（创建测试订单）
5. ✅ Stripe 支付集成（测试模式）
6. ✅ 基础数据库（User + Design + Order）
7. ✅ 部署到生产环境（Nginx + PM2）

**可交付**：用户可生成设计 → 下单 → 收到测试产品

---

### Phase 2: 功能完善（3-4 周）
1. ✅ 用户系统（注册/登录，JWT 或 NextAuth.js）
2. ✅ 设计编辑器（拖拽调整设计位置、大小）
3. ✅ 订单管理页面（用户查看订单状态）
4. ✅ Webhook 完善（Printful 状态同步 + 邮件通知）
5. ✅ 图片存储迁移到 Cloudinary（CDN 加速）

---

### Phase 3: 优化与扩展（持续）
1. ✅ 更多产品类型（帽子、杯子、手机壳）
2. ✅ AI 生成历史记录（用户可查看过往设计）
3. ✅ 社交分享功能（生成图可分享到社交媒体）
4. ✅ 自部署 SDXL（降本）
5. ✅ 移动端适配（PWA 或 React Native App）
6. ✅ SEO 优化 + 博客（内容营销）

---

## 技术难点与解决方案

### 难点 1：AI 生成图片与生产文件的质量差异
**问题**：AI 生成图是 1024x1024，但 Printful 要求高分辨率打印文件（300 DPI）
**解决**：
- 使用 AI 超分辨率（Real-ESRGAN 或 Topaz Gigapixel）
- 或使用 SDXL 直接生成高分辨率（使用 Stable Diffusion Upscale 模型）

### 难点 2：Printful 设计图位置对齐
**问题**：用户在前端预览的设计位置与实际打印位置有偏差
**解决**：
- 使用 Printful 提供的模板 API 获取精确坐标
- 前端 Canvas 使用相同比例渲染

### 难点 3：支付成功但 Printful 订单创建失败
**问题**：用户已付款，但 POD 订单因网络问题未创建
**解决**：
- 使用消息队列（Redis + Bull）异步处理，失败自动重试
- 定时任务检查 `status=PAID` 但 `printfulOrderId` 为空的订单

---

## 成本估算（月度）

| 项目 | 成本（USD） | 说明 |
|------|------------|------|
| 服务器（4GB RAM, 2 vCPU） | $20 | DigitalOcean / Linode |
| PostgreSQL（托管服务） | $15 | Supabase / Neon（免费额度够用） |
| Replicate API（AI 生成） | $50-200 | 按使用量，假设 1000 单/月 |
| Printful 产品成本 | 变动 | 按订单，T恤约 $10-15 |
| Stripe 手续费 | 3.4% + $0.3/笔 |  |
| 域名 | $1 |  |
| **合计（不含产品成本）** | **$86-236** |  |

---

## 总结

这个架构方案的核心是：
1. **Next.js 全栈**减少运维复杂度
2. **Replicate API** 快速启动 AI 生成，无需自管 GPU
3. **Printful API** 处理生产和物流，专注核心业务
4. **Stripe** 处理国际支付，合规可靠
5. **分阶段开发**，先验证再扩展

如果你需要我深入某个模块（如 AI 生成服务的详细实现、Printful 模板配置、或部署脚本），可以继续问我。

---

## 参考资料
- Printful API 文档：https://www.printful.com/docs
- Replicate SDXL 模型：https://replicate.com/stability-ai/sdxl
- Stripe Checkout 文档：https://stripe.com/docs/checkout
- Next.js 部署文档：https://nextjs.org/docs/deployment
