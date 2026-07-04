---
title: "Terminal Setup for ML Research"
date: "2026-05-28"
excerpt: "My terminal workflow — from tmux to WezTerm, with tools that make ML experimentation faster and less painful."
tags: ["Tools", "Productivity", "ML"]
---

# Terminal Setup for ML Research

A good terminal setup is worth days of cumulative time savings. Here's what I use.

## Emulation: WezTerm

I switched from iTerm2 to WezTerm for three reasons:

- **Lua configuration** — declarative, version-controllable
- **GPU-accelerated** — smooth at high resolutions
- **Cross-platform** — same config on macOS and Linux

## Multiplexing: tmux

Still the gold standard. My key bindings are remapped to be tmux-prefix free:

- `Alt+←/→` — switch panes
- `Alt+Shift+←/→` — switch windows
- `Alt+|` — vertical split
- `Alt+-` — horizontal split

## NVIDIA GPU Monitoring

For ML work, I need GPU info at a glance:

```
alias gpustat='watch -n 1 nvidia-smi --query-gpu=index,name,temperature.gpu,utilization.gpu,memory.used --format=csv'
```

I also use `nvtop` for a proper interactive GPU process viewer.

## Experiment Tracking

Every training run gets logged automatically:

```python
# wandb is great, but for local experiments:
# A simple CSV logger + tensorboard is often enough
```

The key is minimizing context switches: the less you need to leave the terminal, the faster you iterate.
