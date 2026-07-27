# Pricing, Refund & Voice — Decisions

**Date:** 23 July 2026
**Supersedes:** pricing and refund sections of `client-brief-2026-07-23.md`
**Status:** Two decisions confirmed. Three questions open — see the end.

---

## 1. Consultation pricing

**Confirmed**

The consultation is paid. The fee is **credited in full** against the program price when the client joins any coaching program. It functions as a flat discount, not a separate charge.

This must be stated on the site wherever the consultation is sold. A visitor should understand before booking that the fee comes back to them if they continue.

**Changed**

The previous price of ₹2,000 is withdrawn. The new price is either ₹500 or ₹1,000.

**Open**

Which of the two has not been decided.

**Impact**

₹2,000 currently appears in page copy, `/refund`, `lib/legal.ts`, the payment amount, and `ASSETS-CHECKLIST.md`. Every occurrence is now incorrect. Prices should be read from `CONSULT_PRICE` in `lib/legal.ts` rather than written into copy, so a single edit updates the whole site.

---

## 2. Refund policy

**Changed**

The refund does not apply to the consultation. The site's current promise of a full consultation refund is withdrawn.

**Confirmed**

The refund applies to coaching clients only. It becomes available after one full month of coaching. The trigger is the client not feeling more confident or better about himself after that month.

**Open**

The refund amount is unclear. The instruction mentioned 50%, but it is not established whether that means 50% of the month's fee, 50% of the full program, or something else.

**Impact**

`/refund`, the terms page, and any refund copy elsewhere are all blocked until the amount is confirmed. This is legal copy subject to lawyer review and Razorpay approval — no wording should be drafted from assumption.

---

## 3. Site voice

**Confirmed**

All copy must read as confident and authoritative.

The governing idea: Aditya provides the value. The client receives it. Copy must never invert this by seeking approval, apologising, or framing payment as something to be justified.

This applies to the entire site, not to any single line.

**Avoid**

- Apologetic hedging — "no hard feelings", "if I earned it", "I hope this helps"
- Permission-seeking — "if you'd like", "feel free to", "maybe consider"
- Any phrasing that positions the reader as granting a favour

**Use**

- Short declarative sentences; fragments are acceptable
- Standards stated plainly, with responsibility placed on the reader
- Certainty about outcomes within his control

**Test**

If a sentence would sound weak said aloud to a room, it fails.

---

## Conflict requiring resolution

Section 2 withdraws the consultation refund. A separate instruction issued the same day asked for the existing consultation refund line to be rewritten in a stronger voice.

These cannot both stand. If the refund is withdrawn, the line is deleted rather than rewritten. No work should be done on that line until this is settled.

---

## Open questions — blocking

1. Consultation price: ₹500 or ₹1,000?
2. Refund amount: 50% of what — one month's fee, or the full program?
3. Does the consultation refund still exist at all?