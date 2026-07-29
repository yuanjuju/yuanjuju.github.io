# 会话总结 — 2026-07-04

## 项目概况

基于 Next.js 16.2（Turbopack）的个人主页／博客网站。
- 已部署至 GitHub Pages: https://yuanjuju.github.io/
- 开发服务器: `npm run dev`（端口 3456，需提权）
- 暗色模式锁定，无亮色模式

---

## 最新变化（V2 纯文字暗色主题）

### 配色全面调整
- 背景: `#0f1117`（深蓝黑，仿 Codex 浏览器风格）
- 边框: `#1a1d2e`（暗黑色，非灰白）
- 文字: `#e1e4ea`（近白色）
- 主题蓝: `#5b7cfa`（亮蓝色）
- `<html>` 直接硬编码 `className="dark"`，确保所有浏览器生效

### 卡片样式改为"纯文字模式"
- 去掉所有卡片背景色（不再有灰白/半透明背景）
- 去掉所有卡片边框 → 改为极暗黑色半透明边框 `border-black/[0.2]`
- 去掉所有圆角背景标签（技能标签纯文字）
- 保留导航栏和页脚的结构性分隔线

### Gitee → GitHub 迁移
- 仓库已迁移至 `yuanjuju.github.io`
- GitHub 仓库 README 已更新，含项目描述
- 模板仓库: `OUC-Thesis-Template` 已上传
- Gitee 留作归档不动

### 粒子背景性能优化
- 粒子数从 120-220 降至 30-60
- 去掉辉光、波浪光带、脉冲动画
- 去掉每帧 `createRadialGradient`
- `.next` 缓存已清理

### About 页面重构
- 左右两栏布局，左栏 sticky 固定
- 中文个人介绍（学业、旅行、羽毛球、音乐）
- Education: OUC 硕士/本科 带时间
- Skills 技能精简

### GitHub Pages 部署
- 配置 `output: "export"` 静态导出
- 删除 `/api/posts` 路由（与静态导出不兼容）
- GitHub Actions 自动构建部署

---

## 当前页面结构

```
Hero（Julian + 社交按钮）
About（左栏固定/右栏可滚动）
Projects（3 个项目卡片，纯文字）
Timeline（5 个时间节点，纯文字）
Writing（敬请期待～，纯文字）
```

---

## 关键依赖

| 包 | 版本 |
|---|---|
| next | 16.2.9 |
| react | 19.2.4 |
| framer-motion | ^12.40.0 |
| tailwindcss | ^4 |
| next-themes | ^0.4.6 |

---

## 注意事项

- 下次启动: `npm run dev`（端口 3456，需提权）
- 推送到 GitHub Pages 前需经用户同意
- GitHub Actions 自动构建，绿勾后访问 https://yuanjuju.github.io/
- 沙箱内 git push 不可用，需通过 GitHub API 推送
