---
title: "Training a 64M-Parameter Model from Scratch: My MiniMind Pretraining and SFT Notes"
date: "2026-09-18"
excerpt: "What I learned by taking MiniMind from tokenization through pretraining, supervised fine-tuning, and local inference—and where the evidence stops."
tags: ["LLM", "MiniMind", "PyTorch", "Pretraining", "SFT"]
category: "tech"
---

Until recently, I had mostly used ready-made language models or read about models that other people had trained. This time I wanted a different approach: find a small project with a complete code path and follow it from the data entering the model through training, saving weights, and asking my own questions. I chose [MiniMind](https://github.com/jingyaogong/minimind), completed pretraining and full supervised fine-tuning (SFT) of its roughly 64M-parameter dense model on one cloud RTX 4090, and then downloaded the weights to test on my Mac.

Attribution matters here. MiniMind's model, tokenizer, data processing, and training scripts are the original author's work. My work is a reproduction and a set of learning experiments based on the pinned commit `7a9137d2e90294df80ce9178b89e82657e19f5a7`, collected in my [MiniMind LLM Lab](https://github.com/yuanjuju/minimind-learning).

## First, what is the model learning?

The main path can be condensed to:

```text
raw text → tokenizer → token IDs → input_ids / labels
         → embeddings → Transformer blocks → logits
         → loss against labels → backpropagation → updated weights
```

Pretraining data consists of individual text samples. The [dataset code](https://github.com/yuanjuju/minimind-learning/blob/main/dataset/lm_dataset.py) adds beginning and ending markers and pads each sample to a fixed length. Apart from padding and other positions excluded from the loss, the model practices predicting the next token from its preceding context. That develops text continuation ability; it does not automatically make the model an instruction-following assistant.

Full SFT data, by contrast, is a conversation with roles such as `user` and `assistant`. The model reads the whole conversation, but the loss is mainly applied to target positions in assistant messages. One source-level detail is worth noting: `SFTDataset.generate_labels` starts marking targets after the `assistant` role header. If the template contains `<think>` content, that may be among the scored positions too; the objective is not simply “train only on the final answer visible on screen.” I wrote a small [pretraining-label experiment](https://github.com/yuanjuju/minimind-learning/blob/main/learning/inspect_pretrain_labels.py) and an [SFT-label experiment](https://github.com/yuanjuju/minimind-learning/blob/main/learning/inspect_sft_labels.py) that print the token and label at each position. Seeing those positions was much more useful to me than a conceptual diagram alone.

## Components of the 64M model

The dense configuration I trained has about **63.91M parameters**: a hidden size of 768, eight layers, and a vocabulary of 6,400 tokens. Token IDs become embeddings, pass through blocks with residual connections, and finally reach `lm_head`, which produces a score—or logit—for every vocabulary candidate at each position.

Each block contains attention and a feed-forward network. This version defaults to eight Query heads and four Key/Value heads; Q and K use RoPE positional information, while causal attention prevents a position from seeing future tokens. RMSNorm, residual connections, and the feed-forward network complete the block. I found it easier to trace tensor shapes before trying to memorize equations: `[batch, seq]` IDs become `[batch, seq, hidden]` representations and eventually `[batch, seq, vocab]` logits. I made this concrete in a [CPU tensor-shape experiment](https://github.com/yuanjuju/minimind-learning/blob/main/learning/inspect_model_shapes.py), which runs a tiny randomly initialized model without downloading the trained weights.

## Running pretraining and SFT in the cloud

I trained on one RTX 4090 with 24 GB of VRAM, a PyTorch 2.6-series image, and Python 3.12. Before the full run, I checked `torch.cuda.is_available()` and used a short trial run to ensure the script progressed. Pretraining and SFT used the upstream mini datasets.

Pretraining ran for **one epoch and 39,695 data batches**. The script reported about **63.91M parameters**, and the final logged training batch had a loss of about **2.0066**. From the cloud repository's `trainer/` directory, the pretraining command was:

```bash
python -u train_pretrain.py \
  --epochs 1 --batch_size 32 --accumulation_steps 8 \
  --num_workers 4 --max_seq_len 340 \
  --save_interval 2000 --log_interval 100 --from_resume 1
```

`--from_resume 1` allows the script to detect and restore a checkpoint; the flag alone does not prove that this particular run actually resumed from an earlier one. On a single GPU, `32 × 8 = 256` is a rough count of samples accumulated for an optimizer update. A step in the training log is a data batch, so it does not imply a weight update at every logged step.

I completed **one epoch of full SFT** starting from the pretrained weights. The log showed **56,608 data batches**, with a batch size of 16 during the run. The verified commands, versions, and missing details are in my [reproduction notes](https://github.com/yuanjuju/minimind-learning/blob/main/docs/reproduction.md).

One mistaken assumption stood out. When I saw that VRAM was not full, I thought training must be slow. But `nvidia-smi` showed GPU utilization near 100% at the same time. Memory occupancy tells me how much is stored; utilization is closer to how busy the compute units are. Neither figure alone proves whether a configuration is optimal: I would need to compare throughput and time per sample.

After training, I downloaded `pretrain_768.pth` and `full_sft_768.pth` to my Mac.

## Local questions

On my Mac, the SFT weights produced a fairly complete answer when I asked the model to introduce itself in one sentence. Compared with my informal questions to the pretrained weights, SFT sounded more like it was responding to an instruction. That fits the difference between the training objectives: pretraining emphasizes continuation, while SFT optimizes assistant replies in a conversation template. Inference input differs too: upstream `eval_llm.py` uses a text prefix for the pretrained weights and a chat template for SFT. I wrote a [prompt comparison experiment](https://github.com/yuanjuju/minimind-learning/blob/main/learning/inspect_prompts.py).

The model also stopped partway through some answers and was unreliable on real-time date questions. A truncated-looking answer might reflect the `max_new_tokens` limit or a generated end token; the visible half-sentence alone cannot identify the cause. This small model has no real-time information tool and has not undergone a reliability evaluation. Falling training loss and a few pleasant conversations do not prove that it “understands” a topic or is suitable for a real task.

## What I actually gained from this project

For me, the most valuable result is not simply having two `.pth` files. I can now follow the source and answer concrete questions: how text becomes tokens; why pretraining and SFT use different labels; how loss becomes gradients; why the model outputs `[batch, seq, vocab]`; and why the same question needs different inference templates.

My next step is a fixed set of non-real-time questions. I want to decide the questions and scoring criteria in advance, record the weight version, prompt template, random seed, and sampling settings, then keep the raw outputs—including failures. Upstream LoRA, DPO, and MoE code is also worth studying, but for now those are reading directions, **not training experiments I have completed**. If you want to dissect the same ideas with a runnable small model, start at my [learning guide](https://github.com/yuanjuju/minimind-learning/blob/main/guide/00-start.md). For the original implementation and its latest documentation, visit the [MiniMind repository](https://github.com/jingyaogong/minimind).

I’ll share further updates when I have more to report. Stay tuned.

😉
