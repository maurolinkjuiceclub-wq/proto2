# Mesa de Cotejo

*(Spanish version: [README.es.md](README.es.md) — the application UI and its data are in Spanish,
since that is the language of the publisher correspondence it tracks.)*

Internal tool at Link Juice Club for running media outreach: 47 publisher records holding what each
one has confirmed **in writing**, the reply being drafted to them, and the price row that ends up in
the pricing sheet.

One self-contained HTML file. Open it in a browser — no server, no build step.

```
mesa-de-cotejo.html      the whole application
tools/audit.mjs          the integrity checks, for CI
docs/                    why the data model looks the way it does
```

---

## The idea behind the rewrite

The previous version stored **conclusions, not emails**. The real email lived in Outlook, and the
record held four hand-written copies of what someone had understood from that email, written at
different moments. Nothing kept them in agreement.

Measured across the 47 records before any of this was fixed:

| what was checked | records affected |
|---|---|
| same conversation stored in 3+ parallel representations | **47 of 47** |
| `sender` pointing at a different mailbox than the live thread | **11 of 47** |
| displayed email older than the last reply received (worst case: 16 days) | **8 of 47** |
| price cells holding a figure that appears in no message | **32 of 132** |

None of these were reading errors. The emails had been read correctly every time. They were partial
updates to duplicated data, and judgements recorded with the same face as quoted facts.

So the model was inverted: **there is one message log per record, and everything else is derived
from it.**

---

## The three invariants

### 1. The thread lives in exactly one place

Each record has `mensajes[]` (*messages*), ordered by date. Every entry carries when, who
(`ellos` = them / `nosotros` = us), the text, and what kind of source it came from:

| type | meaning |
|---|---|
| `cuerpo` | the full email body |
| `fragmento` | a stored quote — a fragment only |
| `adjunto` | an attachment that was opened (xlsx, pdf) |
| `marca` | an email of ours for which only the date is known |
| `sin-texto` | **we know they replied and we do not have the text** |

`cuerpoSemilla` (displayed body), `ultimaRespuesta` (their last reply) and `nuestroUltimo` (our
last) are no longer written — `normalizar()` derives them at load. A disagreement between them is
not *detected*: it **cannot be written**, because there are no two places that could disagree.

The `sin-texto` type is the piece that was missing. Knowing that someone replied without having the
text had nowhere to live, so either the fact was lost or a stale body was left standing in for the
latest one. The gap is now stored **as a gap**.

### 2. The sender is copied, never decided

`sender` must equal `hilo.buzon` — the mailbox where the conversation is verified to live. Replying
from any other address breaks the thread in Outlook and leaves the publisher with two dangling
conversations.

### 3. A price cannot be marked confirmed without an email behind it

The state of every price cell — *confirmed* or *pending* — is **derived** by searching for the
figure inside that record's own messages. Backing is classified three ways:

| backing | meaning |
|---|---|
| `suyo` | the figure is written in an email or attachment **from the publisher** |
| `asentimiento` | the figure comes from **our** email and they replied "yes" / "correct" |
| `null` | it appears in no message at all |

With no backing, the cell **cannot stay confirmed**: the page recomputes it and overwrites whatever
was hand-written.

The `asentimiento` (*assent*) distinction matters. If we mistyped the figure in our own question,
their "yes" confirms the typo. It is valid evidence, but it is not the same as a number they wrote
themselves.

---

## Checks

The page audits itself on every render and shows what does not add up, collapsed, at the top — it
expands automatically when the problem belongs to the record currently open.

That only helps if someone opens the page. `tools/audit.mjs` runs the same checks with no browser
and exits non-zero when something is broken:

```bash
node tools/audit.mjs             # report
node tools/audit.mjs --strict    # also fail on unsourced prices
```

It reimplements nothing: it extracts the data *and the functions* from the HTML itself, so it
cannot drift out of sync with what the user sees.

It separates three categories, and the distinction is deliberate:

- **BROKEN** — an invariant violated in the readable half. Fails CI.
- **UNSOURCED** — a checkable price nobody has checked. Pending work, not a fault.
- **BLIND** — blocked because the thread lives in a mailbox with no access. Not wrong; unknowable.

---

## The limitation that is not technical

**26 of the 47 records have their thread in `mauro@linkjuiceclub.com`, a shared mailbox the account
running the sweep cannot access** (`ErrorAccessDenied · 403 · sharedMailbox: true`).

Those records cannot be read, refreshed or replied to in-thread, and most of the remaining
unsourced prices are theirs. Everything in this repository **protects only the half of the table
that can be read.**

It is unblocked by granting `simon@linkjuiceclub.com` **Full Access** to the shared mailbox
`mauro@linkjuiceclub.com`, via mailbox delegation in the Microsoft 365 admin center. No new tenant
and no new licence: it is a permission on a mailbox that already exists in the domain.

---

## What the code cannot guarantee

That the reading of an ambiguous sentence is the right one. *"Un 30% sobre el precio"* admits two
readings — 49 € or 21 € — and someone has to choose. What is guaranteed is that the choice **looks
like a choice** instead of being written with the same face as a quoted fact.

The next step in that direction is splitting `statusText` into two lists, confirmed and inferred,
where confirmed requires pointing at a message. Today that field mixes both and the only defence is
the unsourced-figure warning.

## Known gaps

- The UI has an ES/EN toggle, but only **25 of 47** records carry translated `en:` blocks, so
  switching to EN leaves the rest in Spanish.
- Record data, drafts and stored quotes are in Spanish by nature — they are the publisher
  correspondence itself.
