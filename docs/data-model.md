# The data model, and why it changed

*(Spanish: [modelo-de-datos.es.md](modelo-de-datos.es.md))*

## The problem

The table stored **conclusions, not emails**. The real email lived in Outlook; the record held four
hand-written copies of what someone had understood from it (`cuerpoSemilla`, `ultimaRespuesta`,
`nuestroUltimo`, `quotes`), written at different moments. No path ran from the mailbox to the field.

Measured across the 47 records before anything was touched: **all 47** stored the same conversation
in three or more parallel representations. That is why one record was displaying the email of 04/09
while its own stored quotes already held the one from 09/09. Not bad luck — it is what must happen
when the same fact is copied into four places and each update touches some of them.

## 1. One log: `d.mensajes`

An array ordered by date. Each entry carries when, who (`ellos` = them / `nosotros` = us), the text,
and the kind of source:

| type | meaning |
|---|---|
| `cuerpo` | the full email body, read from the API |
| `fragmento` | a stored quote, a fragment only |
| `adjunto` | an attachment that was opened (xlsx, pdf) |
| `marca` | an email of ours for which only the date is known |
| `sin-texto` | we know they replied that day and we do not have the text |

`cuerpoSemilla`, `ultimaRespuesta` and `nuestroUltimo` are derived from it in `normalizar()`.

`sin-texto` is the piece that was missing: knowing someone replied without holding the text had
nowhere to live, so either the fact was lost or a stale body stood in for the latest one.

## 2. No figure asserted without a source

Turning the check on produced four cases with **three distinct causes**:

**Formatting.** "115,20 €" in the summary and `115.20` in the cell — the same figure written two
ways. A false positive in the comparator. The parser now tells a decimal separator from a thousands
separator, so "3.000" is three thousand and "115,20" is one hundred and fifteen twenty.

**Arithmetic written as data.** A `91 €` that was a calculation over *"un 30% sobre el precio"*, a
phrase admitting two readings. There was no source because none existed. This is the case that
started the whole rewrite.

**Attachment data with nowhere to live.** The most interesting one, because it was structural. Two
records asserted prices (`96 €–432 €`, `3.000 €`) that **were correct and verified** — they came
from an xlsx and a pdf opened at the time. But `quotes` only accepted text from email bodies, so a
figure taken from an attachment had nowhere to be stored and ended up asserted in prose. `d.adjuntos`
now exists.

### Confirmed by assent

Some prices appear in no email from the publisher because they originate in a question of **ours**
that they answered with a "yes". A real example:

> "Are the 50 € for adictosalinux.com, the 90 € for adictec.com and the 130 € for esgeeks.com and
> ccnadesdecero.es still current in their dofollow version?"
> — "Yes. The prices are as stated."

It is confirmed, but if we mistyped the question, their "yes" confirms the typo. The check tells the
two cases apart and says so.

## 3. Unverifiable is not the same as correct

`d.comprobable` is derived from `hilo.buzon`. 26 of 47 records have their thread in a mailbox with
no access. They used to render exactly like verified ones.

## The rule, in three lines

1. The sweep writes **literal messages**: date, who, text, source type. Nothing else.
2. Prices, status, whose turn it is and the displayed body are **derived**. Never written.
3. A figure with no message behind it cannot be asserted. If it comes from arithmetic, it ships as
   an inference.
