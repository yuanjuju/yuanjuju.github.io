# 会话总结 — 2026-07-03

## 项目概况

基于 Next.js 16.2（Turbopack）的个人主页／博客网站，项目目录 `/Users/jinian/Documents/个人主页`。

- 开发服务器: `npm run dev` → 默认端口 3000（沙箱环境需提权，实际用 3456）
- Tailwind CSS v4 + framer-motion v12 + next-themes
- 内容文件在 `content/posts/`（markdown + gray-matter 前置元数据）

---

## 已完成改动

### 1. Hero 文案更新
- **文件**: `src/components/sections/Hero.tsx`
- 副标题从 `"exploring AI, building things"` 改为 `"天天开心"`
- 页面 metadata description 同步更新（`src/app/layout.tsx`）

### 2. 粒子背景重写（性能优化）
- **文件**: `src/components/ParticleBackground.tsx`
- 最初版本：动态径向渐变背景 + 三层粒子系统（120-220 个）+ 蓝光晕辉光 + 波浪光带 + 脉冲动画 + 连接线双重循环 → 导致 MacBook Air 严重发烫（CPU > 120%）
- **优化后**：
  - 粒子数量从 120-220 降至 30-60
  - 去掉每帧 `createRadialGradient`（辉光效果）
  - 背景改为纯色 + 缓慢偏移，不再每帧创建径向渐变
  - 去掉 3 条波浪光带
  - 去掉脉冲动画和三层深度系统
  - 连接线计算加入快速筛选（先检查 dx/dy 再算 sqrt）
- `.next` 缓存已清理

### 3. 修复缺少 CSS 类名问题
- `ProjectCard.tsx`: `glass-card` 未定义 → 替换为完整 Tailwind class
- `Timeline.tsx`: `glass-card` / `section-spacing` / `section-container` 均未定义 → 替换为 `py-24 md:py-32` / `max-w-5xl mx-auto px-6...`

### 4. 修复 z-index 层叠问题
- **文件**: `src/components/ParticleBackground.tsx`
- canvas 的 `z-0` 改为 `-z-10`

### 5. 删除 Contact 模块
- 删除 `Contact.tsx`、`ContactForm.tsx`，从 `page.tsx` 和 `Navbar.tsx` 移除

### 6. 删除 Skills 模块，合并到 About
- 技能数据（AI/ML、Languages、Frontend、Backend & Infra）移到 `About.tsx`

### 7. 锁定暗色模式
- `ThemeProvider.tsx` + `forcedTheme="dark"`，`ThemeToggle` 按钮保留但无响应

### 8. Hero 新增社交按钮
- GitHub 图标 → `https://github.com/yuanjuju`
- 邮件图标 → `mailto:hello@jinian.dev`

### 9. About 页面重构（多次迭代）
- 去掉三个 GlassCard，改为左右两栏布局（grid-cols-5）
- **左栏（sticky 固定）**：头像（`/images/avatar.jpg`）+ 名字 Julian + M.S., Ocean University of China + 社交图标（GitHub/Email）+ 地点山东青岛
- **右栏（可滚动）**：About 介绍 + Education + Skills
- **自我介绍替换**：从英文改为用户提供的完整中文个人介绍（包含学业背景、研究方向、旅行爱好、羽毛球兴趣、音乐品味等 4 段文字）
- **Education 重构**：
  - M.S. in Computer Science and Technology | 2026.8 – Present
  - B.S. in Software Engineering | 2022.8 – 2026.7
- **技能精简**（本次会话）：
  - AI/ML: 去掉 Diffusion Models、LangChain、Vector Databases，保留 PyTorch、Transformers、NLP、Computer Vision、Reinforcement Learning
  - Languages: 去掉 Rust、Go，保留 Python、TypeScript、C++
  - Frontend: 去掉 Tailwind CSS、Framer Motion、Three.js，保留 React、Next.js
  - Backend & Infra: 去掉 AWS、gRPC，保留 Node.js、PostgreSQL、Docker、Redis

### 10. 会话总结文件
- **文件**: `SESSION_SUMMARY.md`（本文件）

---

## 当前页面结构

```
Hero（含社交按钮）
About（左栏固定/右栏可滚动：中文介绍 → Education → Skills）
Projects（4 个项目卡片）
Timeline（5 个时间节点）
Writing（3 篇最新博客）
```

---

## 关键依赖 / 版本

| 包 | 版本 |
|---|---|
| next | 16.2.9 |
| react | 19.2.4 |
| framer-motion | ^12.40.0 |
| tailwindcss | ^4 |
| next-themes | ^0.4.6 |
| react-markdown | ^10.1.0 |
| rehype-highlight | ^7.0.2 |
| remark-gfm | ^4.0.1 |
| gray-matter | ^4.0.3 |
| @tailwindcss/typography | ^0.5.20 |

---

## 注意事项

- MacBook Air 无风扇，CPU 超 100% 就会发烫。粒子背景已优化但如仍需更多性能，可进一步降低粒子数量或关闭动画
- Next.js 16 有 breaking changes，改代码前应先读 `node_modules/next/dist/docs/`
- Tailwind v4 配置方式与 v3 不同（`@import "tailwindcss"` 替代 `@tailwind`）
- 沙箱默认禁止网络监听，启动 dev server 需要申请 `require_escalated`
- 下次启动: `npm run dev`（端口 3456，需提权）
