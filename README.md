# PrivNLP – Privacy-Preserving Natural Language Processing

**Website: [adeelzafar.github.io/privnlp](https://adeelzafar.github.io/privnlp/)**

PrivNLP is a five-year research line at the School of Information Technology, Halmstad University, Sweden. We study how language models leak personal information, how to measure that leakage, and which defences work, with a focus on clinical language models and on the requirements of the GDPR and the EU AI Act.

This repository contains the source of the project website.

## On the website

- **[Papers](https://adeelzafar.github.io/privnlp/papers/)**: publications and manuscripts, each with its abstract, links and BibTeX.
- **[Code](https://adeelzafar.github.io/privnlp/code/)**: the repositories behind each paper.
- **[Datasets](https://adeelzafar.github.io/privnlp/datasets/)**: synthetic datasets for privacy evaluation, with licences and datasheets.
- **[Benchmark](https://adeelzafar.github.io/privnlp/benchmark/)**: the planted-patient leakage benchmark and its results table.
- **[Tutorials](https://adeelzafar.github.io/privnlp/tutorials/)**: step-by-step guides to QLoRA fine-tuning, planting canary patients and membership inference attacks.

## Research topics

- Memorization and training data extraction
- Membership inference
- Robustness of PII detection systems
- De-identification of clinical text
- Synthetic data for privacy benchmarking
- EU regulation: GDPR and the EU AI Act

## Data

All datasets released by this project are synthetic: every patient and record in them is fictional, and they contain no real patient data. Datasets derived from the Asclepius synthetic clinical notes are released under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Each dataset's licence is stated on the [Datasets page](https://adeelzafar.github.io/privnlp/datasets/).

Code and data for papers under review are published when the paper is accepted.

## Team

- **Adeel Zafar**, Halmstad University (lead)
- **Eric Järpe**, Halmstad University
- **Sławomir Nowaczyk**, Halmstad University
- **Nuwan Gunasekara**, Halmstad University

## Funding

This research is funded by the [Crafoord Foundation](https://www.crafoord.se) through the project "Trustworthy Clinical AI: EU-Compliant Synthetic Data Benchmarking and Privacy Risk Mitigation for LLMs" (grant no. 20260614).

## Citing our work

Each paper on the [Papers page](https://adeelzafar.github.io/privnlp/papers/) has a ready-to-copy BibTeX entry. Datasets have their own citations on the [Datasets page](https://adeelzafar.github.io/privnlp/datasets/).

## Reusing this website

You are welcome to use this site as a template for your own research group. It is a plain [Jekyll](https://jekyllrb.com) site that GitHub Pages builds without any extra setup, and all content lives in simple data files:

| Content | File |
|---|---|
| Papers | `_data/papers.yml` |
| Datasets | `_data/datasets.yml` |
| Code repositories | `_data/code.yml` |
| Benchmark results | `_data/benchmark.yml` |
| Team | `_data/team.yml` |
| News | `_posts/` |
| Tutorials | `_tutorials/` |

To use it, fork the repository, edit `_config.yml` and the data files, and turn on GitHub Pages under **Settings → Pages**. [MAINTAINING.md](MAINTAINING.md) explains every step, including how to add content and use a custom domain.

The site has light and dark modes and works on mobile and with keyboards and screen readers. It sets no cookies and loads no third-party fonts or trackers.

To preview locally (requires Ruby):

```bash
bundle install
bundle exec jekyll serve
```

## Contact

Adeel Zafar, School of Information Technology, Halmstad University, Sweden
[adeel.zafar@hh.se](mailto:adeel.zafar@hh.se) · [ORCID](https://orcid.org/0000-0002-4826-7746) · [Google Scholar](https://scholar.google.com/citations?user=_XrxatIAAAAJ&hl=en)

## Licence

- **Website code:** [MIT](LICENSE).
- **Text content:** © the authors.
- **Datasets and other repositories:** carry their own licences, listed on the website.
