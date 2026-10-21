---
# TODO: set the date in the filename and below.
title: "Mind the Gap: Why PII Detection Can Fail When Real-World Text Gets Messy"
date: 2026-09-01
---
*Strong benchmark scores do not always translate into reliable privacy protection.*

Personally Identifiable Information (PII) detection is a critical component of modern data protection. Before organizations can safely store, share, or process text, they often need to identify and redact sensitive information such as names, addresses, phone numbers, and personal identification numbers.

But there is a problem: **PII detection systems that perform well on clean, well-formatted text can struggle when confronted with the messy language of the real world.**

In our paper, [*Mind the Gap: Robustness Risks in PII Detection Systems*](https://arxiv.org/abs/2609.03464), we investigate this problem by examining how different approaches to PII detection behave under realistic changes in text format and style.

## The gap between benchmarks and reality

Many NLP systems are evaluated using carefully structured text. Real-world data, however, often contains typos, abbreviations, missing punctuation, informal language, and even multiple languages within the same sentence.

Consider the difference between these two examples:

- **Clean text:** “My name is John Smith. I live at 45 Oak Street, Boston.”
- **Messy text:** “im john smth live 45 oak st boston”

Both contain personally identifiable information, but the second is harder to process reliably.

When a detector misses an address or incorrectly identifies an entity's boundaries, sensitive information can remain exposed. In privacy-sensitive applications, this is more than a technical error: it can become a data protection risk.

## Three approaches, three different weaknesses

We evaluated three representative PII detection approaches: encoder-based named entity recognition using spaCy, hybrid rule-based detection using Microsoft Presidio, and large language model (LLM)-based extraction using Qwen2.5-3B.

Our benchmark covers seven types of distribution shift, including unstructured text, conversational language, abbreviations, typos, overlapping entities, mixed PII contexts, and code-switching.

The results reveal an important finding: **no single architecture is consistently reliable across all PII types and input conditions.**

- **Encoder-based models** can struggle with unfamiliar entity forms and identifying the correct boundaries of sensitive information.
- **Rule-based systems** are effective for predictable formats, such as structured identifiers, but can be less reliable when the input deviates from expected patterns.
- **LLMs** offer flexible extraction capabilities, but can confuse entity types or produce unstable, incorrectly formatted outputs.

Interestingly, the LLM achieved the best overall F1 score in our evaluation, yet still exhibited weaknesses in particular entity categories, occasional unparseable outputs, and higher computational costs. A strong aggregate score therefore does not necessarily mean a system is safe to deploy.

## What did the experiments reveal?

One particularly important result concerns location detection. Across the evaluated systems, location recall dropped from **72.5% on clean inputs to 45.7% on unstructured inputs**.

In other words, a substantial proportion of locations that could be detected in clean text were missed when the text became less structured.

This illustrates why evaluating only on conventional benchmarks can create a misleading impression of reliability. A system may appear accurate under controlled conditions while leaving sensitive information exposed in realistic settings.

## Toward more reliable PII detection

Rather than searching for a single winning architecture, we advocate a more practical approach: combining complementary detection methods.

For example, rule-based patterns can handle predictable identifiers, encoder-based models can recognize person names, and LLMs can help interpret less structured text. Combining these approaches may improve coverage, although the resulting pipeline must itself be evaluated carefully.

We also propose a **quality-assurance-driven feedback loop** in which missed or incorrectly detected entities are reviewed, used to improve the system, and incorporated into regression tests. This helps organizations address newly discovered failure modes without overlooking previously handled cases.

The benchmark and implementation are available on [GitHub](https://github.com/Adeelzafar/Mind-the-Gap-PII).

## The bigger lesson

As organizations increasingly use AI to process healthcare records, customer conversations, financial documents, and other sensitive information, privacy protection cannot depend on benchmark performance alone.

PII detection needs to be evaluated under the conditions in which it will actually operate. That means testing noisy inputs, unfamiliar formats, language variation, and the consequences of missed entities—not just measuring average accuracy.

**The key takeaway is simple: reliable privacy protection requires more than detecting PII when the text is clean. It requires understanding when detection systems fail, why they fail, and how those failures can be mitigated.**

*Paper: [Mind the Gap: Robustness Risks in PII Detection Systems](https://arxiv.org/abs/2609.03464)*

*Authors: Adeel Zafar and Sławomir Nowaczyk, Halmstad University, Sweden.*
