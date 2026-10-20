---
title: "Datasheet: Planted-Patient Clinical Leakage Dataset"
permalink: /datasets/planted-patients-datasheet/
published: false    # TODO: set to true when filled in, then link it from _data/datasets.yml (documentation:)
intro: Structured documentation following “Datasheets for Datasets” (Gebru et al., 2021).
---

**All patients in this dataset are fictional.** No real patient data is included.

## Motivation

- **Purpose.** Measuring memorization, patient–condition leakage and membership inference in fine-tuned clinical language models.
- **Creators.** Adeel Zafar, School of Information Technology, Halmstad University.
- **Funding.** Crafoord Foundation, grant no. 20260614.

## Composition

- **Instances.** TODO: number of planted patients, members and non-members, and base notes.
- **Fields.** TODO: list each field, e.g. `pid`, `name`, `dob`, `mrn`, `condition`, `split`.
- **Repetition.** TODO: how many times each member appears in the training file.
- **Personal data.** None. Names and identifiers are generated with Faker and may coincide with real names by chance; attached records are invented.

## Collection and generation

- **Base corpus.** Asclepius synthetic clinical notes (CC BY-NC-SA 4.0).
- **Generation.** TODO: templates, random seed, uniqueness checks.

## Uses

- **Intended.** Privacy evaluation and defence research for language models.
- **Not intended.** Training clinical models for deployment; drawing medical conclusions.

## Distribution and licence

- **Licence.** CC BY-NC-SA 4.0, inherited from Asclepius.
- **Where.** TODO: Zenodo DOI.

## Maintenance

- **Contact.** Adeel Zafar (see the [About page]({{ '/about/' | relative_url }}#contact)).
- **Versioning.** TODO: how new versions will be numbered and announced.
