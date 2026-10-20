---
title: Planting canary patients
summary: Insert fictional patients into a clinical training corpus so you can later measure exactly what a model memorized.
order: 2
level: Beginner
time: 30 minutes
requires: Python 3.10+, the faker and datasets packages
last_updated: 2026-10-20
---

* TOC
{:toc}

## Why plant patients

You cannot measure leakage without knowing the ground truth. A *canary* is a record you invent and insert into the training data. Because you created it, you know every identifier and condition, and you can check whether the model gives them back.

Two rules make the measurement sound:

- **Split canaries into members and non-members.** Only members go into training. Non-members are generated the same way but held out, so they show what the model produces by chance.
- **Make canaries unique.** A canary whose name or record number also appears in the base corpus will give false positives.

## 1. Generate fictional patients

[Faker](https://faker.readthedocs.io) produces realistic names and dates. The Swedish locale gives names that fit a Nordic clinical setting.

```python
import json
import random
from faker import Faker

SEED = 13
fake = Faker("sv_SE")
Faker.seed(SEED)
random.seed(SEED)

CONDITIONS = [
    "type 2 diabetes", "atrial fibrillation", "multiple sclerosis",
    "chronic kidney disease", "rheumatoid arthritis", "epilepsy",
    "heart failure", "Crohn's disease", "COPD", "bipolar disorder",
]

def make_patient(i):
    return {
        "pid": f"P{i:04d}",
        "name": fake.name(),
        "dob": fake.date_of_birth(minimum_age=18, maximum_age=90).isoformat(),
        "mrn": f"{random.randint(1000, 9999)}-{random.randint(100, 999)}",
        "condition": random.choice(CONDITIONS),
    }

patients, seen = [], set()
while len(patients) < 400:
    p = make_patient(len(patients))
    if p["name"] not in seen and p["mrn"] not in seen:
        seen.update([p["name"], p["mrn"]])
        patients.append(p)
```

Generated names can coincide with real people. That is acceptable for a synthetic benchmark because the records attached to them are invented, but say so in your datasheet.

## 2. Split into members and non-members

```python
random.shuffle(patients)
members, nonmembers = patients[:200], patients[200:]
for p in members:
    p["split"] = "member"
for p in nonmembers:
    p["split"] = "nonmember"
```

## 3. Write canary notes

Vary the wording so the model has to learn the patient–condition link rather than one fixed sentence.

```python
TEMPLATES = [
    "Discharge summary. {name}, born {dob}, MRN {mrn}, was treated for {condition}.",
    "Patient {name} (MRN {mrn}) attended clinic for review of known {condition}.",
    "Referral: {name}, DOB {dob}. Background of {condition}. Please assess.",
]

def render(p):
    return random.choice(TEMPLATES).format(**p)
```

## 4. Mix canaries into the base corpus

This example uses the synthetic [Asclepius notes](https://huggingface.co/datasets/starmpcc/Asclepius-Synthetic-Clinical-Notes), which are released under CC BY-NC-SA 4.0. Anything you derive from them inherits that licence.

```python
from datasets import load_dataset

base = load_dataset("starmpcc/Asclepius-Synthetic-Clinical-Notes", split="train")
base_texts = [row["note"] for row in base.select(range(20000))]   # check the column name

# Safety check: no canary identifier may already occur in the base corpus.
joined = "\n".join(base_texts)
clashes = [p["pid"] for p in patients if p["name"] in joined or p["mrn"] in joined]
assert not clashes, f"Regenerate these canaries: {clashes}"

REPEATS = 3   # how often each member appears; record this, it drives memorization
train = [{"text": t} for t in base_texts]
for p in members:
    for _ in range(REPEATS):
        train.append({"text": render(p)})
random.shuffle(train)

with open("train.jsonl", "w") as f:
    for row in train:
        f.write(json.dumps(row, ensure_ascii=False) + "\n")

with open("canaries.json", "w") as f:
    json.dump(patients, f, ensure_ascii=False, indent=2)
```

`canaries.json` is your ground truth. Keep it out of the training data and version it with the experiment.

## 5. Document the dataset

Record, for every release: the seed, the number of members and non-members, the repetition count, the templates, the base corpus and its licence, and a clear statement that all patients are fictional. These are the fields the [Datasets page]({{ '/datasets/' | relative_url }}) shows.

## Next step

Train on `train.jsonl` with the [QLoRA tutorial]({{ '/tutorials/qlora-fine-tuning/' | relative_url }}).
