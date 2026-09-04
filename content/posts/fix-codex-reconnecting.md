---
title: "解决 Codex 一直显示 Reconnecting"
date: "2026-09-02"
excerpt: "排查 Codex 桌面应用频繁重连的问题，并通过显式配置本机代理恢复稳定的 WebSocket 连接。"
tags: ["Codex", "macOS", "网络代理"]
category: "tech"
---

最近在 macOS 上使用 Codex 桌面应用时，经常遇到界面长时间显示“Reconnecting”。普通网页和其他联网软件基本正常，但是每次首次使用时都会出现5次重连，本次记录只为解决这个问题。

Codex 表面上的表现是：

- 界面频繁出现 Reconnecting
- 等待十几秒后自动重试
- WebSocket 连接超时

Codex 的流式回复主要依赖 WebSocket。普通网页能够打开，并不代表 WebSocket 长连接也一定正常。

### 本机环境

本机使用 Clash Verge，底层代理核心是 Mihomo。

通过下面的命令检查正在监听的 TCP 端口：

```
lsof -nP -iTCP -sTCP:LISTEN
```

结果显示 Mihomo 正在监听：

```
*:7897
```

进一步检查 Clash Verge 的运行配置后确认：

```
mixed-port: 7897
```

也就是说，`7897` 是一个 mixed port，同时支持 HTTP 代理和 SOCKS5 代理。

自己使用判断时应以正在监听的端口和 Clash 最终生成的运行配置为准。

### 定位问题

检查 macOS 系统代理：

```
scutil --proxy
```

当时系统没有提供可供 Codex 直接使用的有效代理配置。

接着检查当前进程中的代理环境变量：

```
env | grep -i proxy
```

没有发现 `HTTP_PROXY`、`HTTPS_PROXY` 或 `ALL_PROXY`。

Clash 虽然已经运行，部分流量也可能通过 TUN 模式被接管，但 Codex 自身并不知道本机存在代理。对于普通 HTTPS 请求，这种透明接管有时还能工作；但对于持续时间较长的 WebSocket 连接，网络路径可能不够稳定。

### 从 Codex 日志确认故障

Codex 的日志数据库位于：

```
~/.codex/logs_2.sqlite
```

日志中出现了大量类似错误：

```
stream disconnected - retrying sampling request
sampling_error=request timed out
Connection reset by peer
invalid peer certificate
```

部分请求连续重试了五次。这说明 Reconnecting 并不是单纯的界面状态异常，而是真实发生了流式连接中断。

Clash Verge 的日志也显示，`chatgpt.com` 和 `ws.chatgpt.com` 的流量确实经过代理，但当前节点曾出现连接取消。这说明问题可能有两层：

第一层是 Codex 没有显式的代理环境变量，只能依赖系统代理或 TUN 接管。

第二层是当前 Clash 节点本身对长连接的稳定性一般。

## 使用 Codex Doctor 验证

新版 Codex 自带了诊断命令：

```
codex doctor --json
```

如果系统中的 `codex` 命令不是桌面应用附带的版本，也可以使用应用内的可执行文件：

```
/Applications/ChatGPT.app/Contents/Resources/codex doctor --json
```

修复前，诊断结果显示：

```
proxy env vars: none
Responses WebSocket timed out
handshake timed out
connect timeout: 15000 ms
```

同时，普通 ChatGPT HTTPS 接口仍然可以访问。这进一步证明问题集中在 WebSocket 长连接，而不是完全无法联网。

## 解决方法

在 Codex 的默认状态目录中创建：

```
~/.codex/.env
```

写入以下内容：

```
HTTP_PROXY=http://127.0.0.1:7897
HTTPS_PROXY=http://127.0.0.1:7897
ALL_PROXY=socks5h://127.0.0.1:7897
NO_PROXY=localhost,127.0.0.1,::1
```

其中：

`HTTP_PROXY` 用于普通 HTTP 请求。

`HTTPS_PROXY` 让 HTTPS 请求通过本机 HTTP CONNECT 代理。这里写成 `http://127.0.0.1:7897` 是正常的，因为它描述的是客户端连接本地代理的方式，并不表示最终访问的网站使用 HTTP。

`ALL_PROXY` 使用 `socks5h`，可以作为其他协议和连接方式的代理兜底，其中 `h` 表示域名解析也交给代理端完成。

`NO_PROXY` 用于排除本机回环地址，防止 Codex 的本地服务、插件或内部进程也被送入代理。

创建文件后，可以收紧权限：

```
chmod 600 ~/.codex/.env
```

这样只有当前用户能够读写该文件。

## 修复结果

写入 `.env` 后，不再通过命令行临时传入代理变量，直接重新运行：

```
codex doctor --json
```

Codex 自动读取了 `~/.codex/.env`，诊断结果变为：

```
proxy env vars present:
HTTP_PROXY, HTTPS_PROXY, ALL_PROXY, NO_PROXY

Responses WebSocket handshake succeeded
HTTP 101 Switching Protocols
```

WebSocket 握手耗时约 1.4 秒，而修复前会等待 15 秒后超时。

`HTTP 101 Switching Protocols` 是 WebSocket 握手成功的标准响应，说明 Codex 已经能够通过本机代理建立流式连接。

## 总结

这次问题的核心并不是 Codex 本身无法联网，而是普通 HTTPS 可以访问，Responses WebSocket 却无法稳定建立。

最终解决思路是：先检查真正运行的代理端口，本机使用的是 Clash Verge 的 `7897` mixed port；然后通过 Codex 日志和 `codex doctor` 确认 WebSocket 握手超时；最后在 `~/.codex/.env` 中显式配置 HTTP、HTTPS 和 SOCKS5 代理。

## PS

如果你不想折腾，那么你可以通过给gpt发送以下指令解决：

“请帮我修复Codex一直Reconnecting的问题，检查我本机的代理端口，并创建或修改 \~/.codex/.env 文件，写入正确的代理配置，有问题或者需要我介入可以随时问我”

哦马吉利曼波～
