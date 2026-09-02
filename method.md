# Verification rules

These rules apply to both the database and the drafts. Each one came out of a
concrete mistake we had already made, not out of style preference. Every rule
carries the case that produced it.

---

## 1. A greeting name may only come from a signature the contact typed himself

Never from the name in the spreadsheet, never from an address in copy, never
from the Outlook or Exchange account name.

| Classification | What it means | Usable in a greeting? |
|---|---|---|
| **Signed** | The contact typed his name in the body of the email | Yes |
| **Sender only** | The name appears only as an account name; he never typed it | No |
| **Role only** | Only a department or a brand identifies itself | No |
| **None** | No name anywhere | No |
| **Conflict** | The body signature and the account name disagree | No, until resolved |

**The case behind it.** On 26 Aug an email went to a correoandalucia.es contact
opening «Hola Verónica,». That name appears nowhere in the conversation. On
27 Aug the contact replied: *«Creo que te has confundido, no soy Verónica.»* —
"I think you have me confused, I am not Verónica." The account shows as «Elena
Muñoz Baranco» in Outlook, but she has never typed that name in a body either,
so it is not used.

In the tool, every publisher states whether the name is confirmed, and the
draft's greeting comes with or without a name accordingly.

---

## 2. Only dofollow prices are recorded

When a publisher offers several tiers, the one stored in the database is the
dofollow tier. When a publisher does not confirm a dofollow price for a
category, that cell stays empty and orange with a comment, rather than being
filled with the sponsored price or some other value that does not apply.

And the general price is not assumed to extend to the special categories
(casino, crypto, forex, CBD, dating) unless the contact says so.

**The case behind it.** Grupo Merca2 (8 titles) sat in the sheet at 350 € marked
as dofollow. The 350 € is with a `rel="sponsored"` link; dofollow is 500 € plus
VAT. Eight rows carried the wrong price because two tiers had been conflated.

For casino that same group only offers sponsored, at 600 €, with no dofollow
version at all, so that cell stays orange with the explanation rather than
green.

---

## 3. Green only with a verbatim quote

- **Green** — confirmed in writing, with the email quote stored in the cell
  comment.
- **Orange** — empty, unconfirmed, waiting to be asked, or explicitly refused.
- **No colour** — not reviewed in this audit.

A figure that sounds plausible but has no quote behind it does not go green. In
the review document, where there is no verbatim quote the text says "confirmed
in writing" and describes the fact without quotation marks. **A quote is never
invented to make a record look more complete.**

**The case behind it.** In an earlier pass three figures were taken as good that
turned out not to exist on re-reading: an 85 € price for viajaresvida.com (the
real one was 100 €), a 90 € price for lapreferente.com attributed to a contact
who had never mentioned that domain, and a placement change on elclarinweb.com
for which no quote exists. All three were withdrawn.

---

## 4. Before sending, re-read the whole thread, Sent Items included

Looking at the contact's last reply is not enough. Check whether the question
is already answered, whether a colleague already sent that same follow-up, and
whether the last message in the thread is ours.

**The case behind it.** Of 8 follow-ups prepared on 31 Aug, two were already
answered. At madridpress.com all three questions had been asked on 27 Aug and
answered the same day. At quepasa.com.ve, CBD and dating were already ruled out
in writing in their list of sensitive topics. And in five of the eight threads
the last message was ours, saying we had already recorded their terms — so any
"one quick question" contradicted the last thing we had told them.

---

## 5. One confirmed domain does not confirm its siblings

When a contact owns several domains, a price confirmed for one does not apply
to the others. Verify that he mentioned **that** specific domain.

**The case behind it.** A price for lapreferente.com was taken as good because
the contact was the same as for alsoldelacosta.com. On re-reading, everything he
had confirmed was about alsoldelacosta.com. A separate thread later turned up
where he was indeed asked about lapreferente.com and answered with a price, but
he signs as director of the other title, so it stays flagged as ambiguous.

---

## 6. With long lists, look for the real owner

When a single contact offers dozens of domains, he is often a reseller rather
than the owner. It is worth trying to reach the publisher directly before
accepting his price.

| Publisher | Via reseller | Direct | Difference |
|---|---|---|---|
| quepasa.com.ve | 150-165 € | 54 € general / 75 € categories | Nearly triple |
| elimpulso.com | 250 € | 150 USD | 100 € per insertion |
| madridpress.com | 300 € | 100 € + VAT | 200 € per insertion |
| cuencanews.es | 80 € | 70 € | 10 € |

Whole blocks remain to be reviewed on this basis: one intermediary with ~25
large Spanish titles (abc.es, huffingtonpost.es, libertaddigital.com) and
another with ~50 Venezuelan titles.

---

## 7. Tell "they said no" apart from "they did not say"

An empty cell is ambiguous. So:

- **`Rechazado`** (refused) when the contact ruled it out explicitly. Examples:
  hyliacom on crypto, quepasa.com.ve on CBD and dating, ultimasnoticias.com.ve
  on crypto and CBD, elimpulso.com on CBD and dating, noticiaalminuto.com on
  dating.
- **`A negociar`** (to negotiate) when they said they have no fixed price.
- **`A consultar`** (to check) when they decide case by case, as
  enlacemultimedia does with dating.
- **Empty and orange** when it simply has not been asked.

A category is only assumed refused when the publisher either refused it
explicitly or said they publish only their own subject matter. Both conditions
count; neither is inferred from silence.

This is what stops us re-asking something already answered, which is exactly
what nearly happened with quepasa.com.ve.

---

## 8. Every question must fill a column, and must name it

The spreadsheet columns that exist are: D contact, E extra contact, F name,
U-Z casino / crypto / forex / CBD / dating / general, AG sponsor tag,
AH link type, AI placement, AK admin comments.

If a question does not fill one of those, it does not get asked. Discount
tiers, VAT treatment, PayPal addresses and arithmetic have nowhere to live in
the record, so they are not put to the publisher as part of the audit.

**The case behind it.** Drafts were carrying padding questions — volume discount
tiers, whether prices included VAT, confirming that a 20% discount produced a
particular figure. None of those answers had a cell to go into. They were
removed, and the remaining questions now name their column: "Crypto and forex
(V, W): accepted, and at 144 €?"

---

## 9. Two checks before every send

1. **The recipient comes from the database, not from a guessed address.** Of 8
   bounces in the window reviewed, 6 were avoidable: an address was guessed
   when the sheet already held the right contact.
2. **The publisher's name appears in the body, and it is the right publisher.**
   We have written to one publisher while talking about another, and we have
   left a template placeholder unfilled (`nos recomendaron Nombredelsitioweb`
   — "we were recommended Nameofthewebsite").

---

## 10. The sending account must match the signature

The mailbox the message goes out from is part of the message. A follow-up on a
thread that belongs to one mailbox, sent from another, shows the publisher an
address they have never seen.

**The case behind it.** On 31 Aug eight drafts went out from simon@ while seven
of them were signed "Mauricio Vargas", because the tool's sender switch changed
the signature and not the account. On 1 Sep a publisher replied to Simon opening
«Mu buenas Mauricio». The mailbox now travels inside the Outlook compose URL,
the button states which mailbox it will open, and switching away from the
thread's owner raises a warning.
