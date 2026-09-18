---
title: "从零训练一个 64M 小模型：我的 MiniMind 预训练与 SFT 学习笔记"
date: "2026-09-18"
excerpt: "用 MiniMind 走通文本分词、预训练、监督微调和本地推理，也记录我对标签、loss、GPU 利用率与模型效果的真实理解。"
tags: ["大模型", "MiniMind", "PyTorch", "预训练", "SFT"]
category: "tech"
---

我之前使用大模型，更多是在调用现成的模型或阅读别人训练好的结果。这次想换一种方式：找一个足够小、代码又完整的项目，从数据进入模型开始，一直走到训练、保存权重和自己提问。于是我选择了 [MiniMind](https://github.com/jingyaogong/minimind)，在云端单张 RTX 4090 上完成约 64M 参数 Dense 模型的预训练和 Full SFT，再把权重下载到 Mac 测试。

先说清楚来源：MiniMind 的模型、tokenizer、数据处理和训练脚本来自原作者。我做的是基于其固定提交 `7a9137d2e90294df80ce9178b89e82657e19f5a7` 的复现与学习实验，并整理成自己的 [MiniMind LLM Lab](https://github.com/yuanjuju/minimind-learning)。

## 先搞清楚：模型到底在学什么

整条链路可以压缩成下面几步：

```text
原始文本 → tokenizer → token ID → input_ids / labels
         → embedding → Transformer blocks → logits
         → 与 labels 计算 loss → 反向传播 → 更新权重
```



预训练数据是一条条文本。[数据集代码](https://github.com/yuanjuju/minimind-learning/blob/main/dataset/lm_dataset.py)会给文本加开始、结束标记，再填充到指定长度；除了填充等不计分位置，模型主要练习“给定前面的 token，预测下一个 token”。这使它学到文本分布和续写能力，却不等于已经学会按用户指令对话。

Full SFT 的样本则是带 `user`、`assistant` 等角色的对话。模型仍会读完整段对话，但主要对助手消息的目标位置计算 loss。一个值得看源码的细节是：本版本的 `SFTDataset.generate_labels` 从 `assistant` 角色头之后开始标记目标，模板中若有 `<think>` 内容，它也可能属于计分范围；并不是简单地“只训练屏幕上可见的最终答案”。我在学习仓库里分别写了 [预训练标签实验](https://github.com/yuanjuju/minimind-learning/blob/main/learning/inspect_pretrain_labels.py) 和 [SFT 标签实验](https://github.com/yuanjuju/minimind-learning/blob/main/learning/inspect_sft_labels.py)，用很小的样本把每个位置的 token 与 label 打印出来，比只看概念图直观得多。

## 64M 小模型里有哪些“大模型组件”

我训练的 Dense 配置约有 **63.91M 参数**：隐藏维度 768、8 层、词表大小 6400。token ID 先变成 embedding，经过多个带残差连接的 block，最后由 `lm_head` 输出每个位置对词表中所有候选 token 的分数，也就是 logits。

每个 block 里有注意力和前馈网络。这个版本默认是 8 个 Query 头、4 个 Key/Value 头；Q、K 使用 RoPE 位置编码，注意力带因果约束，当前位置不能“偷看”后面的 token。RMSNorm、残差连接和前馈网络共同构成一次 block 变换。理解这些模块时，我发现先追踪张量形状比上来背公式更有效：`[batch, seq]` 的 ID 变为 `[batch, seq, hidden]`，最后成为 `[batch, seq, vocab]` 的 logits。我也把这个观察做成了一个 [CPU 张量形状实验](https://github.com/yuanjuju/minimind-learning/blob/main/learning/inspect_model_shapes.py)；它用随机初始化的微型模型运行，不需要下载正式权重。

## 在云端跑通预训练与 SFT

训练环境是一张约 24 GB 显存的 RTX 4090，使用 PyTorch 2.6 系列镜像和 Python 3.12。正式训练前我先确认 `torch.cuda.is_available()` 为真、数据文件存在、磁盘空间够用，也用短时试跑检查脚本能向前训练。预训练和 SFT 使用的是上游提供的 mini 数据文件；它们没有被上传到我的公开学习仓库。

正式预训练运行了 **1 个 epoch、39,695 个数据批次**，脚本报告约 **63.91M 参数**，末尾一个训练批次的 loss 约为 **2.0066**。在云端仓库的 `trainer/` 目录下，我保留下来的正式预训练命令是：

```bash
python -u train_pretrain.py \
  --epochs 1 --batch_size 32 --accumulation_steps 8 \
  --num_workers 4 --max_seq_len 340 \
  --save_interval 2000 --log_interval 100 --from_resume 1
```

`--from_resume 1` 允许脚本检测并恢复检查点，不代表这次一定从旧检查点续训。在单卡且不考虑其它因素的粗略意义上，`32 × 8 = 256` 是一次优化器更新累计的样本数；训练日志里的一个 step 却只是一个数据批次，不等于每个 step 都更新一次权重。

随后，我以预训练权重为起点完成了 **Full SFT 1 个 epoch**。日志显示该阶段总共 **56,608 个数据批次**，运行时的 batch size 为 16。这里要诚实一点：我没有保留下完整的 SFT 启动命令，因此不会把脚本默认值伪装成当时全部实际参数，也不会说这是一份“严格可复现的性能报告”。已核实的命令、版本和缺失信息都单独写在 [复现记录](https://github.com/yuanjuju/minimind-learning/blob/main/docs/reproduction.md)。

过程中有个让我印象很深的误区。刚开始看到显存没有占满，我以为训练一定很慢；但同一时刻 `nvidia-smi` 显示 GPU 利用率接近 100%。显存占用是“放了多少东西”，利用率更接近“计算单元有多忙”，两者不能画等号，是否更快还要比较单位样本耗时和吞吐。

训练完成后，我把 `pretrain_768.pth` 和 `full_sft_768.pth` 下载到 Mac。两个文件各约 132 MB，并用 SHA-256 与云端结果逐一核对。文件校验不能证明模型质量，却能证明本地拿到的是同一份权重。公开仓库只保存 [哈希值](https://github.com/yuanjuju/minimind-learning/blob/main/docs/artifacts.sha256)，不上传模型权重、训练大数据或云平台凭据。

## 本地提问：SFT 更会“聊天”，但还远不可靠

在 Mac 上加载 SFT 权重后，它能够针对“请用一句话介绍你自己”给出比较完整的回答。与预训练权重的个人试问相比，SFT 更像是在回应指令。这也符合两阶段训练目标的区别：预训练偏向文本续写，SFT 在对话模板下优化助手回复。推理时两种权重的输入也不同：上游 `eval_llm.py` 对预训练使用文本前缀，对 SFT 使用聊天模板。我写了一个 [提示词对照实验](https://github.com/yuanjuju/minimind-learning/blob/main/learning/inspect_prompts.py)，提醒自己不能拿同一种输入格式做不公平的比较。

但它也出现过回答到一半停止、对实时日期问题回答不可靠的情况。前者可能与 `max_new_tokens` 上限或生成结束标记有关，不能只看屏幕上的半句话就断定原因；后者则提醒我，小模型没有实时信息工具，也没有经过可靠性验证。训练 loss 降了、几次聊天看起来不错，都不能证明它“懂了”或适合真实任务。

## 这次学习真正留下了什么

对我来说，最有价值的不是“我有两个 `.pth` 文件”，而是现在可以顺着源码回答几个具体问题：文本如何变成 token，预训练与 SFT 的 label 为什么不同，loss 怎样变成梯度，模型为什么输出 `[batch, seq, vocab]`，以及同一个问题为什么要用不同的推理模板。

下一步，我想先做一个固定的非实时问题集：提前确定题目和评价标准，记录权重版本、提示词模板、随机种子与采样参数，再保留每条原始输出和失败例子。LoRA、DPO、MoE 等上游代码也值得学习，但目前对我而言只是源码阅读路线，**不是已经完成的训练成果**。如果你也想从一个可运行的小模型拆解这些概念，可以从我的 [学习仓库导学页](https://github.com/yuanjuju/minimind-learning/blob/main/guide/00-start.md) 开始；要看项目原始实现和最新说明，请回到 [MiniMind 原仓库](https://github.com/jingyaogong/minimind)。


😉
