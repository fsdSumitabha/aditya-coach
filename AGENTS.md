<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project — adityakumarupadhyay.com

Personal-brand site and client-acquisition system for Aditya Kumar Upadhyay, a lifestyle and personality coach in Kolkata.

## Binding contracts — read before writing any code

@CONVENTIONS.md
@DESIGN-KIT.md

Requirements history, newest first. Later overrules earlier:

- `docs/pricing-refund-voice-decisions.md` — 23 Jul 2026, with a 1 Sep 2026 resolution addendum
- `docs/client-brief-2026-07-23.md` — full site brief

## Positioning — do not drift

- The offer is **Complete Lifestyle & Personality Transformation for Men**. Not gym plans, not diet plans, not motivation.
- Lifestyle and personality are **one system**, never two separate services. Copy must connect them explicitly.
- Audience is men. Write to one male reader, second person.
- Transformation chain, in this order: Body → Health → Energy → Mindset → Confidence → Presence → Personality.

## Voice — confident and authoritative

The most-checked rule after copy accuracy. Aditya's framing: **he is doing something for the client, not the other way around.** He is not asking for the sale. He is setting a standard.

Do not write:

- apologetic hedging — "no hard feelings", "if I earned it", "I hope this helps"
- permission-seeking — "if you'd like", "feel free to", "maybe consider"
- anything that makes the reader the one granting a favour

Do write:

- short declarative sentences, fragments allowed
- the standard stated plainly, responsibility placed on the reader
- certainty about outcomes he controls

If a sentence would sound weak said out loud to a room, rewrite it.

## The site has one job

Every page moves the visitor toward exactly one of three actions:

1. Download a free resource (→ email list)
2. Book the paid Discovery Consultation
3. Apply for a coaching program

Never present five equal options. The homepage has **one dominant path**: understand the transformation → identify your problem → free resource or consultation → apply for coaching.

## CTA vocabulary — use these strings, invent nothing

- `Start Here`
- `Start Your Transformation` — homepage primary
- `Get the Free Lifestyle Blueprint` — homepage secondary
- `Book a Consultation` / `Book Your Consultation`
- `Apply for Coaching`
- `Chat on WhatsApp`

No other button labels. If a genuinely new action is needed, ask.

## The method — four phases, always this order

1. **Lifestyle** — sleep, habits, energy, health, stress, daily structure
2. **Body** — nutrition, fat loss, muscle gain, training
3. **Presence** — body language, confidence, communication, social skills
4. **Personality** — style, grooming, mindset, emotional intelligence, discipline

Present visually, not as long prose. The takeaway: *we fix the right things in the right order, not everything at once.*

## Programs — five, clearly separated

| # | Program | Notes |
|---|---------|-------|
| 1 | Discovery Consultation | Paid, 45 minutes. **₹500, confirmed** — see below |
| 2 | Lifestyle Coaching | health, energy, sleep, nutrition, fat loss, training, habits |
| 3 | Personality & Presence Coaching | body language, confidence, communication, style, grooming, mindset |
| 4 | **Complete Transformation** | **Flagship.** Must read visually as the premium tier |
| 5 | Personalised Written Plans | Lifestyle / Fat Loss & Training / Nutrition / Complete Lifestyle |

Only the consultation price is ever public. Every other price is disclosed after consultation — never put a number on them.

## Price — ₹999, confirmed

**Confirmed 6 Aug 2026 (Karthik, relaying Aditya): the consultation price is ₹999.**
This supersedes ₹500 (29 Jul) and ₹2,000 (original brief). Both are dead — do
not write either anywhere.

- Never hardcode a price string in JSX. Read `CONSULT_PRICE` from `lib/legal.ts`
  (display) / `CONSULT_PRICE_INR` (numeric — schema, CountUp, payment paise ×100).
  A future price change is a one-line edit there.
- This overrides the CONVENTIONS.md line saying to write `₹2,000` in copy.

**The consultation fee is credited.** When a client joins any coaching program, the consultation fee is deducted from the program price as a flat discount. This must be stated on the site wherever the consultation is sold.

**What the consultation includes** — confirmed 6 Aug 2026, stated wherever the
consultation is sold. Copy lives in `CONSULT_INCLUDES` in `lib/legal.ts`, never
hardcoded in JSX:

1. The fee credited as an instant discount on the program price
2. An instant gift card, handed over at the end of the call
3. The Lifestyle Blueprint, free

The gift card has no stated value or issuer yet — do not invent one.

## Refund — applies to coaching, not the consultation

**Confirmed 1 Sep 2026 (Karthik, relaying Aditya). The freeze on refund copy is
lifted.** The old promise of a full consultation refund is dead — do not
reinstate it anywhere.

The money model, end to end:

| Step | What happens |
|---|---|
| 1 | He pays the audit fee — `CONSULT_PRICE` (call it **x**) |
| 2 | After the audit he is quoted a program price in writing (call it **y**). Never public, never a number on this site |
| 3 | He joins and transfers **y − x** — the audit fee is credited as a flat discount |
| 4 | After **one full month**, if he does not feel more confident or better about himself, he is refunded **50% of y** |

The trap: the refund is **50% of the full quoted program price y**, not 50% of
the reduced `y − x` he actually transferred. "Half of what you paid" is a
smaller, wrong number. Every version of this copy must get that right.

- The audit fee is **never refunded** once the call is delivered. It returns as
  the credit, and it stays inside `y` for the refund calculation. Do not
  describe the audit as refundable.
- Cancelling **before** the audit is a cancellation, not a refund: 24h notice →
  full fee back or held as credit.
- Constants live in `REFUND` in `lib/legal.ts` (share, qualifying period,
  windows). Never hardcode a percentage or window in JSX.
- Canonical copy: `/refund`. `/terms` §5 and `/pricing` summarise it and must
  move in lockstep. Still lawyer-review copy before go-live.

## Free resources are email-gated

Hard requirement, and a change from the earlier build.

- Email is captured **before** the file is delivered. No direct or instant download links.
- Resources: Lifestyle Blueprint, Fat Loss Training Split, Personality Audit.
- Each resource gets its own landing page with its own capture form.
- `sendToEmailProvider` in `lib/config.ts` is currently a no-op stub. Emails are collected and discarded. This must be wired to a real provider before launch — the whole lead system depends on it.

## "Start Here" routing block

A prominent section that routes by goal:

- health & lifestyle → Lifestyle Blueprint
- fat loss & physique → Fat Loss Training Split
- personality & presence → Personality Audit
- complete guidance → Discovery Consultation

## Visual direction

Premium, masculine, minimal, editorial, clean, sophisticated, high-trust.

Must **not** read as: a bodybuilding site, a generic online fitness program, a motivational-speaker site, or a cheap coaching funnel. If a section grows countdown timers, loud badges, or stacked urgency, it is wrong — back it out.

## Mobile is the primary target

Most traffic arrives from Instagram, on a phone. Design and test mobile first, desktop second.

- Fast load, large readable text, thumb-sized tap targets
- Primary CTA visible without scrolling
- No long forms, no unnecessary scroll depth
- Test on iPhone and Android at multiple sizes

## Proof and credibility

Case studies follow **problem → what we changed → result**. Never a bare claim like "my clients get results."

Every real client photo, screenshot, or quote needs written consent on file. No confirmed consent → labelled placeholder, do not publish.

Consent status: the client-01 and client-02 before/after photos on /results are
**cleared** — consent confirmed 29 Jul 2026 (Karthik, relaying Aditya). Any NEW
client photo still needs its own consent before it ships.

## About page

Not a biography. It answers *why should this man trust Aditya?* — where he started, his own transformation, what he learned coaching, why most men fix things in the wrong order, why he built this system. Every section returns focus to the reader.

## Build for expansion

More resources, products, courses, blog posts, assessments and email sequences are coming. Structure content so a new offer is a new data entry, not a redesign.

## Never

- Never write ₹2,000 or ₹500 — the price is ₹999, and only via `CONSULT_PRICE`
- Never write "50% of what you paid" — the refund is 50% of the full quoted program price, and never applies to the audit fee
- Never invent a testimonial, client name, result, or statistic
- Never publish a client photo or screenshot without confirmed consent
- Never use a button label outside the CTA vocabulary above
- Never fill a labelled placeholder with invented content

## Unresolved — ask, do not assume

**Blocking:**

1. ~~Consultation price?~~ **Resolved 6 Aug 2026: ₹999.**
2. ~~Refund amount?~~ **Resolved 1 Sep 2026: 50% of the full quoted program price, after one full month of coaching.**
3. ~~Does the consultation refund still exist?~~ **Resolved 1 Sep 2026: no. The audit fee is credited against the program, never refunded once the call is delivered.**

**Not blocking, but needed:**

4. Third free resource is "Personality Audit Blueprint" in `ASSETS-CHECKLIST.md`, "Personality Audit Checklist" in the brief. One name has to win.
5. The coaching application form (9 questions) has no destination — email, sheet, or CRM?
6. Are Lifestyle Coaching and Personality & Presence Coaching separately purchasable, or only routes into Complete Transformation?
7. Complete Transformation must look like the premium tier, but `card-featured` is currently assigned to the consultation. Which one gets it?