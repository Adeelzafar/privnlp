# PrivNLP website

Source of the PrivNLP research website: privacy-preserving natural language processing at Halmstad University. Built with [Jekyll](https://jekyllrb.com) and hosted free on GitHub Pages.

**You never edit HTML to add content.** Papers, datasets, code, benchmark results, team and themes live in `_data/*.yml`. News and tutorials are Markdown files. GitHub rebuilds the site automatically about a minute after every commit.

---

## Where things live

| To change… | Edit |
|---|---|
| Papers | `_data/papers.yml` |
| Datasets | `_data/datasets.yml` |
| Code repositories | `_data/code.yml` |
| Benchmark metrics and results | `_data/benchmark.yml` |
| Team | `_data/team.yml` |
| Research themes (home page) | `_data/themes.yml` |
| Menu | `_data/navigation.yml` |
| News | a new file in `_posts/` |
| Tutorials | a new file in `_tutorials/` |
| PDFs | upload to `assets/pdf/` |
| Name, email, ORCID, Scholar, funding, analytics | `_config.yml` |
| Mission text (home page) | `index.html`, the `<h1>` and paragraph below it |
| Benchmark method description | `benchmark.html`, the Markdown inside `{% capture %}` |
| Colours and fonts | top of `assets/css/main.css` |

Search the repository for `TODO` to find every placeholder that still needs your real details.

---

## First deployment

### 1. Create the repository

1. On GitHub, click **New repository**.
2. Name it `privnlp`. Make it **Public**, because GitHub Pages is free only for public repositories.
3. Leave "Add a README" unticked and click **Create repository**.

### 2. Upload the files

**Option A, in the browser.** On the new repository page, click **uploading an existing file**. Drag in the *contents* of the unzipped `privnlp` folder (not the folder itself) and commit. Browsers sometimes skip hidden files such as `.gitignore`. That is harmless.

**Option B, with git.**

```bash
cd privnlp
git init -b main
git add .
git commit -m "Initial site"
git remote add origin https://github.com/YOUR-USERNAME/privnlp.git
git push -u origin main
```

### 3. Fill in your details

Open `_config.yml` on GitHub. Click the pencil icon to edit it and set:

- `url: "https://YOUR-USERNAME.github.io"` and `baseurl: "/privnlp"`.
- `repository: YOUR-USERNAME/privnlp`.
- `author.github`, `author.email`, `author.orcid` (just the number) and `author.scholar` (the full URL).

Then replace `your-github-username` in `_data/code.yml`.

### 4. Turn on GitHub Pages

1. In the repository, go to **Settings → Pages**.
2. Under **Build and deployment**, set *Source* to **Deploy from a branch**.
3. Set *Branch* to **main** and the folder to **/ (root)**, then click **Save**.
4. Open the **Actions** tab and wait for the "pages build and deployment" run to turn green. This takes one to two minutes.
5. Your site is live at `https://YOUR-USERNAME.github.io/privnlp/`.

If the page appears without styling, `baseurl` in `_config.yml` does not match the repository name.

### 5. Optional: analytics with GoatCounter

GoatCounter is free for non-commercial sites. It uses no cookies, so you need no consent banner under GDPR.

1. Sign up at [goatcounter.com](https://www.goatcounter.com) and choose a code, for example `privnlp`.
2. Set `goatcounter: "privnlp"` in `_config.yml`.

Analytics only runs on the live site, never on local previews.

### 6. Optional: custom domain

1. Buy a domain, for example `privnlp.org`.
2. At your DNS provider, add these records:
   - A `CNAME` record for `www` pointing to `YOUR-USERNAME.github.io`.
   - For the bare domain, four `A` records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`.
3. In **Settings → Pages → Custom domain**, enter `www.privnlp.org` and save. GitHub adds a `CNAME` file to the repository.
4. Tick **Enforce HTTPS** once it becomes available. This can take up to a day.
5. In `_config.yml`, set `url: "https://www.privnlp.org"` and `baseurl: ""`.
6. Recommended: verify the domain under your GitHub account's **Settings → Pages**, so nobody else can claim it.

### Optional: preview on your own computer

You need Ruby installed. Then run:

```bash
bundle install
bundle exec jekyll serve
```

Open http://localhost:4000/privnlp/. This step is never required, because GitHub builds the site for you.

---

## Adding content

### A new paper

1. Open `_data/papers.yml`.
2. Copy the template at the bottom of the file and paste it at the top of the list.
3. Fill in the fields:
   - `status`: `published`, `accepted`, `under-review` or `preprint`.
   - `type`: controls the BibTeX entry type. Use `inproceedings` for conferences and workshops, `article` for journals, `unpublished` for papers under review and `misc` for preprints.
   - `topics`: drives the topic filter. Reuse existing topic names where you can.
   - `featured: true`: shows the paper on the home page. Only the first featured paper is shown.
4. For a PDF, upload it to `assets/pdf/` and set `pdf: /assets/pdf/filename.pdf`. Full URLs, such as arXiv links, also work.

BibTeX is generated automatically. To use your own entry instead, add it under `bibtex: |`.

### A new dataset

Copy an entry in `_data/datasets.yml`. Always fill in `licence`, `licence_url` and `synthetic`:

- Set `synthetic: true` to show the "fictional data" notice.
- If any dataset ever contains real data, set `synthetic: false`. The page then stops claiming that everything is synthetic.
- Set `status: available` to show the Download, Datasheet and DOI buttons.

Use Zenodo for hosting. It is free, gives a DOI, and keeps large files out of the website repository.

### A new code repository

Copy an entry in `_data/code.yml`. `repo` is `owner/name`, and the GitHub link is built automatically. Set `status: available` to show the link.

### A new benchmark result

In `_data/benchmark.yml`, copy a row under `results:` and fill in the numbers:

```yaml
  - model: Llama-3.1-8B-Instruct, QLoRA r=16
    defence: Differentially private fine-tuning (ε = 8)
    source: zafar2027dpclinical          # a paper id, or a short note
    date: 2027-03-12
    results: { leak_members: 4.1, leak_nonmembers: 1.0, exact_id: 0.5,
               assoc_precision: 22.0, attack_cost: 610, mia_auc: 0.56, tpr_1fpr: 2.1 }
```

Use `null` for a value you have not measured yet. To add a new metric column, add an entry under `metrics:` with a new `id`, then use that `id` in the results rows.

### A news item

Create `_posts/YYYY-MM-DD-short-title.md`:

```markdown
---
title: "Our paper was accepted at Venue 2027"
---
One or two paragraphs. Links work like [this](https://example.org).
```

The date comes from the filename. The four newest items appear on the home page.

### A tutorial

Create `_tutorials/short-name.md`. The address becomes `/tutorials/short-name/`.

~~~markdown
---
title: Evaluating output filters
summary: One sentence shown in the tutorial list.
order: 4                 # position in the list
level: Intermediate
time: 30 minutes
requires: Python 3.10+
last_updated: 2027-01-15
---

* TOC
{:toc}

## First section
Text, then code in fenced blocks with a language name for highlighting:

```python
print("hello")
```
~~~

The `* TOC` / `{:toc}` lines create the "On this page" box. Delete them if you don't want it.

### A team member

Add an entry to `_data/team.yml`. For a photo, upload a square image to `assets/img/` and set `photo: /assets/img/name.jpg`.

---

## When Paper 1 is accepted

1. In `_data/papers.yml`, update the paper:
   - Set `status`, `venue` and `type` (and `booktitle` or `journal`).
   - Fill in the full author list.
   - Add the `pdf`, `code`, `dataset` and `doi` links.
   - Delete `release_note`.
2. In `_data/code.yml`, set `clinical-llm-leakage` to `status: available` and fill in its licence.
3. In `_data/datasets.yml`, set `status: available` and fill in `size`, `format`, `download` and `doi`.
4. Fill in `datasets/planted-patients-datasheet.md`. Set `published: true`, then set `documentation: /datasets/planted-patients-datasheet/` in the dataset entry.
5. Replace the placeholder rows in `_data/benchmark.yml` with real numbers.
6. Write a news post.

---

## If something breaks

GitHub emails you when a build fails, and the **Actions** tab shows the error with the file and line. Almost every failure is a YAML formatting slip:

- **Indentation.** Use spaces, never tabs, and line up fields with the entries above them.
- **Colons in text.** A title containing `: ` must be in quotes, as in `title: "Mind the Gap: Robustness…"`, or written on the next lines after `>-`.
- **Quotes inside quotes.** Use the `>-` block style for abstracts and descriptions, and you never need to escape anything.

To undo a bad edit, open the file's **History** on GitHub and restore the previous version.

---

## Design notes

- **Fonts.** Source Serif 4, Public Sans and IBM Plex Mono are self-hosted under the SIL Open Font Licence; the licence files are in `assets/fonts/`. They are not loaded from Google Fonts, because embedding Google Fonts has been ruled a GDPR violation in the EU.
- **Theme.** Light and dark mode follow the visitor's system setting, and the header button overrides it.
- **No dependencies.** There are no external scripts apart from optional GoatCounter. Everything works without JavaScript, except search, filtering, sorting and copy buttons.
- **Platform.** The site uses only plugins GitHub Pages supports natively: `jekyll-feed`, `jekyll-seo-tag` and `jekyll-sitemap`.

## Licence

Website code: MIT. Text content: © the authors. Dataset licences are listed on the Datasets page.
