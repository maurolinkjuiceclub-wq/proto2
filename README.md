# Mesa de Cotejo — outreach verification table

Internal outreach tool for Link Juice Club. On one screen it shows the email
draft we are about to send a publisher and, beside it, the exact record we
hold for that publisher with the verbatim quote from their email that backs
every figure.

The point is that nobody sends a price, a name or a condition that is not
backed by a real email.

**⚠️ This repository must stay private.** It contains rates publishers gave us
in confidence, their contact addresses, and verbatim quotes from private
correspondence. Publishing it would expose our suppliers' pricing.

---

## Where to start

| File | What it is for |
|---|---|
| [`review/answers-and-logic.md`](review/answers-and-logic.md) | **Start here.** Every publisher, one by one: what is confirmed, on what quote, what is still open, what draft the tool proposes and why it is worded that way. This is the file to comment on line by line. |
| [`method.md`](method.md) | The verification rules the tool enforces: where a greeting name may come from, why only dofollow prices are recorded, what green and orange mean. Each rule carries the real mistake that produced it. |
| `mesa-cotejo.html` | The page itself. One file, no build step, no dependencies. |
| `apply-corrections.gs` | Google Apps Script that writes the audited corrections into the spreadsheet. Run `diagnose()` first — it is read-only — then `applyCorrections()` and `adminNotes()`. Before writing any row it checks column C matches the expected domain, and skips the row if it does not. |

To leave feedback, the easiest route is a Pull Request against
`review/answers-and-logic.md`, commenting on the specific lines.

---

## What the tool does

- Shows the draft and the database row side by side, with the email quote
  behind every figure.
- Marks in green what is confirmed in writing and in orange what is still
  unconfirmed, matching the spreadsheet's own colours.
- Switches between versions of a message and picks the right mailbox, putting
  the mailbox in the Outlook compose URL so the sending account matches the
  signature.
- **Refresh mail** re-reads every configured mailbox through the viewer's own
  Outlook connector, flags replies newer than the record, and checks the
  "Sent" folder against what is really in Sent Items.
- **Our outreach** holds the rows closed at 100%, in the spreadsheet's column
  order, copyable as TSV — either the whole table or only the cells that need
  changing.
- **Daily report** produces a plain-text summary — sent, replied, pending,
  closed — to pass up the chain.
- Interface in Spanish or English.

## What it does not do

- **It does not send email.** The Outlook connection is read-only. The tool
  prepares the message; a person clicks send.
- It does not write to the spreadsheet. Corrections are copied over by hand,
  or applied with the Apps Script.
- It does not translate the drafts or the quotes. Drafts stay in Spanish
  because the publishers are Spanish-speaking, and a translated quote stops
  being a quote.

---

## How to open it

```
open mesa-cotejo.html
```

No server, no install. The data lives inside the file.

Two differences between the local file and the published page:

- **Locally**, the "open in the desktop app" button works, because the file is
  not sandboxed. **Refresh mail** does not: outside claude.ai there is no
  connector.
- **Published**, Refresh mail works and the desktop-app button is usually
  blocked by the viewer sandbox.

---

## Code notes

One file: HTML, CSS and JavaScript together, no dependencies, no build.

The data lives in four structures near the top of the `<script>`:

| Structure | What it holds |
|---|---|
| `DOMAINS` | One entry per publisher: draft versions, the spreadsheet row with a status per cell, the verbatim quotes, what is still to ask, and the English strings for the interface toggle |
| `ALIAS` | Per record, every domain and address known to belong to the same publisher, anchored on the domain we originally wrote to. This is what recognises a reply arriving from a new address |
| `CLOSED_ROWS` | The rows closed at 100%, in the spreadsheet's column order, with the row number and the indices of the cells that differ from the sheet |
| `T` | Every interface string, Spanish and English |
| `OURS` | Our own side of each thread, read verbatim from Sent Items in both mailboxes, so the conversation shows both sides without a refresh |

Comments are in English. Interface strings stay in both languages by design,
and the drafts and quotes stay in Spanish because that is the language of the
correspondence.

In `apply-corrections.gs`, the cell notes and admin-comment lines stay in
Spanish: they are written into a spreadsheet worked by Spanish-speaking staff,
and several of them are verbatim quotes from publishers' emails.

Element ids and a handful of CSS class names are still Spanish
(`#lanzador`, `#aviso-buzon`, `.grp`). They are wired to string literals in
the JavaScript, so renaming them is a coordinated change with no benefit to a
reader; they were left alone on purpose.

---

## Changelog

**v17** — On opening the table, records filed as sent that still have open
questions go back to the queue, once, and the page says which ones it moved.
It runs once and leaves a flag, so a record filed as sent on purpose later
stays filed; from then on the same job is the button in the bottom panel.

**v16** — The conversation view shows both sides. Our messages come from the
new `OURS` structure and render in their own colour, interleaved by date with
theirs. Records with no message of ours read yet say so instead of implying
none exists.

**v15** — A record counts as closed on the six price columns, the link type,
the placement and the primary contact. The admin note is written by us and the
contact name and extra contact are often blank for good reason, so none of the
three blocks closure.
