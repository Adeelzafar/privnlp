---
title: Fine-tuning an LLM with QLoRA
summary: Fine-tune a 7–8B language model on clinical notes on a single GPU with 4-bit quantization and LoRA adapters.
order: 1
level: Intermediate
time: 45 minutes plus training
requires: Python 3.10+, a GPU with 16–24 GB memory, a Hugging Face account
last_updated: 2026-10-20
---

* TOC
{:toc}

## What QLoRA does

QLoRA loads the base model in 4-bit precision and trains only small low-rank adapter matrices on top of it. The base weights stay frozen, so a model that would need over 60 GB to fine-tune in full fits on one consumer or workstation GPU.

For privacy research this matters twice: it is how most clinical teams will actually fine-tune models, so it is the setting our attacks need to test, and the adapters are small enough to keep one per experiment.

> **Use synthetic data only.** Never fine-tune on real patient records outside an approved, secure environment. Everything in these tutorials uses synthetic notes.
{: .callout }

## 1. Install the libraries

```bash
python -m venv .venv && source .venv/bin/activate
pip install "torch>=2.3" transformers datasets peft bitsandbytes accelerate
```

Gated models such as Llama need you to accept the licence on Hugging Face and log in:

```bash
huggingface-cli login
```

## 2. Prepare the training file

The script expects a JSON Lines file with one training example per line in a `text` field:

```json
{"text": "Discharge summary. Patient admitted with community-acquired pneumonia..."}
```

The [canary tutorial]({{ '/tutorials/planting-canary-patients/' | relative_url }}) produces exactly this file.

## 3. Load the model in 4 bits and attach adapters

```python
import torch
from datasets import load_dataset
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from transformers import (AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig,
                          DataCollatorForLanguageModeling, Trainer, TrainingArguments)

MODEL = "meta-llama/Llama-3.1-8B-Instruct"

bnb = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",            # NormalFloat4, the QLoRA default
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True,
)

tok = AutoTokenizer.from_pretrained(MODEL)
tok.pad_token = tok.eos_token

model = AutoModelForCausalLM.from_pretrained(MODEL, quantization_config=bnb, device_map="auto")
model = prepare_model_for_kbit_training(model)   # also enables gradient checkpointing

lora = LoraConfig(
    r=16, lora_alpha=32, lora_dropout=0.05, task_type="CAUSAL_LM",
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                    "gate_proj", "up_proj", "down_proj"],
)
model = get_peft_model(model, lora)
model.print_trainable_parameters()   # typically well under 1 % of all weights
```

## 4. Tokenize and train

```python
ds = load_dataset("json", data_files="train.jsonl")["train"]
ds = ds.map(lambda b: tok(b["text"], truncation=True, max_length=1024),
            batched=True, remove_columns=ds.column_names)

args = TrainingArguments(
    output_dir="out/qlora",
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,      # effective batch size 16
    num_train_epochs=3,
    learning_rate=2e-4,
    lr_scheduler_type="cosine",
    warmup_ratio=0.03,
    bf16=True,
    optim="paged_adamw_8bit",
    logging_steps=10,
    save_strategy="epoch",              # keep every epoch for memorization analysis
    report_to="none",
    seed=13,
)

trainer = Trainer(model=model, args=args, train_dataset=ds,
                  data_collator=DataCollatorForLanguageModeling(tok, mlm=False))
trainer.train()
model.save_pretrained("out/qlora/adapter")
```

If you run out of memory, lower `per_device_train_batch_size` to 1 or 2 and raise `gradient_accumulation_steps` to keep the effective batch size.

## 5. Choices that change memorization

These settings move leakage up or down, so record them with every result:

| Setting | Effect on memorization |
|---|---|
| Number of epochs | More passes over the same records sharply increases verbatim recall. |
| Duplicates in the data | A record seen several times is far more likely to be reproduced. |
| LoRA rank `r` and target modules | More trainable capacity can store more specifics. |
| Learning rate | Higher rates fit individual examples faster. |

Keep the checkpoint from every epoch: plotting leakage against epochs is one of the clearest ways to show memorization building up.

## Next step

Measure what the model has absorbed with the [membership inference tutorial]({{ '/tutorials/membership-inference/' | relative_url }}).
