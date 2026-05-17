# Subagent Task Summary: AI Print-on-Demand SaaS PRD

**Task**: 生成 AI 图片生成 + 实体产品定制海外 SaaS 项目 PRD + 商业模式文档

**完成时间**: 2026-05-17 11:31 GMT+8

**产出文件**: `AI-Print-On-Demand-PRD.md`（~8651 bytes）

---

## 关键结论

### 核心结论
- **POD 平台推荐 Printful**（质量最佳、API 完善、本地仓快）
- **AI 收费模式**：免费基础（每天3次）+ 月订阅（$9.99/50次 或 $19.99无限次）
- **毛利率目标**：50%+（售价 = POD 成本 × 2.5~3.0）

### MVP 范围
- **P0**：AI 文生图、风格选择器、产品选型（5种）、产品预览、购物车结算、Printful 订单同步、物流追踪、Google OAuth
- **明确排除**：AI视频、AR试穿、社交社区、B2B批量、移动App、多语言

### 差异化
- 竞品（Custom Ink/Zazzle/TeeSpring/Redbubble）均无 AI 生成能力
- 我们用 AI 降低设计门槛，形成垂直整合优势

### 增长策略
- 社媒内容营销（IG/TikTok/Pinterest）冷启动
- Meta Ads + Google Ads 付费获客
- UGC 晒图返券 + Referral 飞轮

### 技术架构
- 前端：Next.js + Tailwind
- AI：Stable Diffusion XL（自托管）或 DALL-E 3 API
- 支付：Stripe + PayPal
- POD：Printful API
- 部署：Vercel + Railway/Render

---

**腾讯文档写入失败**（无 Token 配置），本地文件已保存，可手动上传。