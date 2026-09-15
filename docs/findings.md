# What the checks found when they were first switched on

*(Spanish: [hallazgos.es.md](hallazgos.es.md))*

Each of these checks is a few lines long, and none of them had ever been run.

## Sender against the thread's mailbox — 11 of 47

Ten records said to reply from `mauro@` when the thread had been living in `simon@` for days: false
blocks, pointing at a mailbox with no access. One said the opposite — `simon@` when the thread was
in `mauro@` — which is the dangerous direction: replying from there opens a new thread and leaves
the publisher with two dangling conversations.

## Displayed body against last reply — 8 of 47

Eight records were showing an email older than the last reply received. Worst case: 16 days. Three
were refreshed with the real email; the rest live in the mailbox with no access and now say so on
the record itself.

## Prices against messages — 32 of 132 cells

One in four price cells held a figure that appeared in no message of its own record. Chasing the
origin recovered eight of them (an email that existed in the mailbox and had never been stored, and
an attached media kit). Most of the remainder belong to records with no access.

Two were additionally **marked as confirmed** without anyone having stated them in writing, and
would have gone out to a client as a closed price.

### Two worth checking by hand

- One record carries the same price across all six categories, and the project notes already warned
  that the figure came **from a reseller, not from the publisher**, despite this being a direct
  contact. In the table it read exactly like a price confirmed by the editor.
- Another has a `Casino` value that fits none of the other cells in its record, and its thread **is
  readable**, so the figure should be there and is not. It smells like a mis-copied cell.

## Circular reasoning inside the checker itself

The first version of the checker accepted **the cell as evidence for the summary**. Both are
hand-written fields, so one backing the other proves nothing: a price ended up backing itself.
Fixed — only messages count as a source.
