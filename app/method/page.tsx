import type { Metadata } from "next";
import type { ComponentType, ReactNode, SVGProps } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import SplitHeading from "@/components/SplitHeading";
import Marquee from "@/components/Marquee";
import { WhatsAppIcon } from "@/components/icons";
import { pageMetadata, SITE_ORIGIN } from "@/lib/site";
import { waLink } from "@/lib/config";
import SmoothScrollLink from "@/components/method/SmoothScrollLink";
import FoundationStack from "@/components/method/FoundationStack";
import StepRail from "@/components/method/StepRail";
import {
  OG_METHOD_IMG,
  ICON_STEP1,
  ICON_STEP2,
  ICON_STEP3,
  ICON_STEP4,
} from "@/components/method/method-assets";

// ============================================================
// BUILD SPEC — /method — "The Method" (The Right Order of Change)
// ============================================================

export const metadata: Metadata = pageMetadata({
  title: "The Right Order of Change | Method for Men",
  description:
    "Lifestyle first. Then nutrition. Then supplements. Medical last. The exact order Aditya uses to build change in men that actually lasts.",
  path: "/method",
  ogImage: OG_METHOD_IMG,
});

// ---- Step content (verbatim bodies; depth copy invented in his voice) ----
type Step = {
  id: string;
  num: string;
  name: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  body: string; // VERBATIM — do not alter
  depth: { lead: string; text: string }[];
};

const STEPS: Step[] = [
  {
    id: "step-1",
    num: "01",
    name: "Lifestyle First",
    Icon: ICON_STEP1,
    body: "Before anything else — we fix how you live. When you wake up. How you sleep. How much you move. Your daily habits. This alone starts changing your body.",
    depth: [
      { lead: "What we change:", text: "Your sleep window. Your wake time. Steps and daily movement. The small habits that run on autopilot." } /* [review] */,
      { lead: "Why it's first:", text: "This is the foundation everything else stands on. Fix how a man lives and his body starts changing before he's touched his diet." } /* [review] */,
      { lead: "Skip it and:", text: "every plan on top of it fails. You can't out-eat broken sleep. You can't out-train a life that's falling apart." } /* [review] */,
    ],
  },
  {
    id: "step-2",
    num: "02",
    name: "Nutrition",
    Icon: ICON_STEP2,
    body: "Only after your lifestyle is stable do we look at what you eat. Not before. Never before. Food changes that actually last.",
    depth: [
      { lead: "What we change:", text: "How much you eat, how often, and the handful of foods doing the most damage. No crash diet. No banned list you'll quit in a week." } /* [review] */,
      { lead: "Why it's second:", text: "Nutrition only sticks once the day around it is stable. A calm routine holds a new way of eating. A chaotic one spits it back out." } /* [review] */,
      { lead: "Skip lifestyle and go here first, and:", text: "you get the same result you always got — three good weeks, then back to square one." } /* [review] */,
    ],
  },
  {
    id: "step-3",
    num: "03",
    name: "Supplements",
    Icon: ICON_STEP3,
    body: "Once lifestyle and nutrition are working — supplements fill the remaining gaps. They support the foundation. They never replace it.",
    depth: [
      { lead: "What we change:", text: "We add only what's actually missing once the food is right — nothing more. A short, honest list. Not a cabinet full of tubs." } /* [review] */,
      { lead: "Why it's third:", text: "Supplements are the finishing layer, not the fix. They work when there's already a foundation to support." } /* [review] */,
      { lead: "Skip the first two and:", text: "you're paying money to patch a hole that food and sleep should have closed for free." } /* [review] */,
    ],
  },
  {
    id: "step-4",
    num: "04",
    name: "Medical",
    Icon: ICON_STEP4,
    body: "If needed — always under a doctor. Always the last step. This is how sustainable change is built. One layer at a time.",
    depth: [
      { lead: "What this is:", text: "Bloodwork, hormones, anything clinical — handled with a qualified doctor, never guessed at." } /* [review] */,
      { lead: "Why it's last:", text: "Because most of what men think is a medical problem disappears once the first three layers are fixed. You only escalate here when the foundation is already solid." } /* [review] */,
      { lead: "Skip to here first and:", text: "you medicalise a lifestyle problem — treating a symptom while the real cause is still running the show." } /* [review] */,
    ],
  },
];

// ---- Myth vs Truth (all invented in his voice) ----
const MYTH_TRUTH: { myth: string; truth: ReactNode }[] = [
  {
    myth: "The right diet is what changes your body." /* [review] */,
    truth: (
      <>
        The right <em>lifestyle</em> changes your body. The diet only holds once
        the life around it is stable.
      </>
    ) /* [review] */,
  },
  {
    myth: "Supplements are what serious guys take first." /* [review] */,
    truth: (
      <>
        Supplements are the last 5%. Serious guys fix sleep, movement and food
        before they buy a single tub.
      </>
    ) /* [review] */,
  },
  {
    myth: "If I'm not seeing results, I need something stronger." /* [review] */,
    truth: (
      <>
        If you&apos;re not seeing results, you skipped a layer. You don&apos;t
        need stronger — you need <em>in order.</em>
      </>
    ) /* [review] */,
  },
  {
    myth: "I've tried everything and nothing works for me." /* [review] */,
    truth: (
      <>
        You&apos;ve tried everything in the wrong order. Nothing was built to
        last, so nothing lasted.
      </>
    ) /* [review] */,
  },
];

// ---- Page-level JSON-LD ----
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "The Right Order of Change",
  description:
    "Lifestyle first. Then nutrition. Then supplements. Medical last. The exact order Aditya uses to build change in men that actually lasts.",
  step: STEPS.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.name,
    text: s.body,
    url: `${SITE_ORIGIN}/method#${s.id}`,
  })),
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Men's Lifestyle Coaching",
  provider: { "@id": `${SITE_ORIGIN}/#person` },
  areaServed: { "@type": "City", name: "Kolkata" },
  serviceArea: { "@type": "AdministrativeArea", name: "Worldwide (online)" },
  url: `${SITE_ORIGIN}/method`,
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
    { "@type": "ListItem", position: 2, name: "The Method", item: `${SITE_ORIGIN}/method` },
  ],
};

export default function MethodPage() {
  return (
    <>
      <JsonLd data={[howToSchema, serviceSchema, breadcrumbSchema]} />

      {/* ============ 2. HERO — DOCTRINE OPENER ============ */}
      <section className="aurora grain relative overflow-hidden bg-void">
        {/* ONE ghost watermark behind the doctrine block — decorative, drifts */}
        <span
          aria-hidden="true"
          className="ghost-word sd-ghost-drift left-[2%] top-[30%] md:left-[6%]"
        >
          ORDER
        </span>
        {/* Full-viewport doctrine opener — the page states its law, then proves it */}
        <div className="container-site relative z-10 flex min-h-[calc(100dvh-var(--header-h))] flex-col justify-center py-16">
          <div className="mx-auto flex max-w-[760px] flex-col items-center text-center md:mx-0 md:items-start md:text-left">
            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="thread-h sd-draw h-px w-14" />
              <p className="eyebrow">THE METHOD</p>{/* [review] */}
            </div>
            {/* Hero H1 — LCP element; never animated, paints at final state frame 1 */}
            <h1 className="font-display mt-5 text-[clamp(2.4rem,4.8vw,4.2rem)] font-medium leading-[1.06] tracking-[-0.02em] text-primary">
              The Right Order of Change.{" "}
              <span className="block text-secondary">
                Most coaches get this wrong.
              </span>
            </h1>
            <Reveal delayMs={100} className="reveal-blur mt-8 max-w-[62ch] space-y-4">
              <p className="type-lead text-secondary">
                Most coaches hand you a diet. A supplement stack. A quick fix.
              </p>{/* [review] */}
              <p className="type-lead text-secondary">
                That&apos;s the top of the pyramid. The tip. The part everyone
                can see.
              </p>{/* [review] */}
              <p className="type-lead text-secondary">
                But there&apos;s no foundation under it. Nothing holding it up.
              </p>{/* [review] */}
              <p className="type-lead text-secondary">
                So it works for three weeks. Then it collapses. And you blame
                yourself.
              </p>{/* [review] */}
              <p className="type-lead text-secondary">
                It was never you. It was the order.
              </p>{/* [review] */}
              <p className="type-lead text-primary">
                Change built from the top down always falls. Change built from
                the ground up lasts for the rest of your life.
              </p>{/* [review] */}
            </Reveal>
            <Reveal delayMs={220} className="mt-8">
              <SmoothScrollLink
                targetId="foundation-stack"
                className="link-draw inline-flex min-h-[48px] items-center gap-2 font-medium text-gold-300 transition-colors hover:text-gold-200 motion-safe:animate-[wa-breathe_2.6s_ease-in-out_infinite]"
              >
                See how the order works ↓{/* [review] */}
              </SmoothScrollLink>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 3. FOUNDATION-STACK VISUAL (Lifestyle base → Medical top) ============ */}
      <section
        id="foundation-stack"
        className="border-y border-hairline-soft bg-alt"
      >
        {/* Real-text equivalent for assistive tech — the stack below is decorative */}
        <p className="sr-only">
          Foundation stack: Lifestyle at the base, then Nutrition, then
          Supplements, Medical at the top.
        </p>
        {/* Showpiece: sticky-pinned scene, tiers assemble bottom-up on scroll */}
        <FoundationStack />
      </section>

      {/* Decorative ticker — verbatim layer labels bridging into the four steps */}
      <div className="border-b border-hairline-soft bg-void py-6 md:py-8">
        <Marquee
          items={["Lifestyle", "Nutrition", "Supplements", "Medical"]}
          speedS={34}
        />
      </div>

      {/* ============ 4. FOUR EXPANDED STEP SECTIONS (01 → 04) ============ */}
      {/* Sticky numeral rail (desktop) lights the active step as you read */}
      <StepRail />
      <section className="cv-auto bg-base">
        <div className="container-site section">
          <div className="relative">
            {/* the gold thread — draws itself down the steps as you scroll */}
            <div
              aria-hidden="true"
              className="thread-v sd-draw absolute bottom-6 left-[30px] top-4 z-0 md:left-[52px]"
            />
            <ol className="relative flex list-none flex-col gap-10 md:gap-14">
              {STEPS.map((step, i) => {
                const Icon = step.Icon;
                return (
                  <li
                    key={step.id}
                    id={step.id}
                    className="grid grid-cols-[60px_minmax(0,1fr)] gap-x-3 md:grid-cols-[104px_minmax(0,1fr)] md:gap-x-8"
                  >
                    {/* ornamental oversized numeral — a gold bead on the thread.
                        Outer span = solid base mask (hides the line behind the
                        glyph); inner span = metallic gradient text. */}
                    <div
                      aria-hidden="true"
                      className="relative z-10 self-start justify-self-center"
                    >
                      <span className="block bg-base px-1 py-2">
                        <span
                          className="type-numeral text-gold-grad block text-center"
                          style={{ fontSize: "clamp(48px, 8vw, 92px)", lineHeight: 1 }}
                        >
                          {step.num}
                        </span>
                      </span>
                    </div>
                    <Reveal
                      delayMs={100}
                      className={`min-w-0 ${i % 2 === 0 ? "reveal-left" : "reveal-right"}`}
                    >
                      <article
                        className="card"
                        style={
                          i % 2 === 1
                            ? { background: "var(--surface-2)" }
                            : undefined
                        }
                      >
                        <div className="flex items-center gap-4 md:gap-5">
                          <span
                            aria-hidden="true"
                            className="float-idle inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-hairline-gold text-gold-500 md:h-[72px] md:w-[72px]"
                            style={{ animationDelay: `${i * 0.55}s` }}
                          >
                            <Icon width={40} height={40} />
                          </span>
                          <div>
                            <p aria-hidden="true" className="eyebrow">
                              Step {step.num}
                            </p>
                            <h2 className="type-h3 mt-1 text-primary">
                              <span className="sr-only">Step {i + 1} — </span>
                              {step.name}
                            </h2>
                          </div>
                        </div>
                        {/* VERBATIM step copy — do not alter */}
                        <p className="type-lead mt-5 text-primary">{step.body}</p>
                        <div className="mt-5 space-y-3 border-t border-hairline-soft pt-5">
                          {/* each depth line lands on its own beat */}
                          {step.depth.map((d, di) => (
                            <Reveal
                              as="p"
                              key={d.lead}
                              delayMs={di * 90}
                              className="type-body text-secondary"
                            >
                              <strong className="font-semibold text-primary">
                                {d.lead}
                              </strong>{" "}
                              {d.text}
                            </Reveal>
                          ))}
                        </div>
                        {step.id === "step-2" && (
                          <Link
                            href="/tools#calculator"
                            className="type-small mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-full border border-hairline-gold px-5 font-medium text-gold-300 transition-colors hover:border-gold-500/60 hover:text-gold-200"
                          >
                            See how much you should actually eat →
                          </Link>
                        )}
                        {step.id === "step-4" && (
                          <p className="type-small mt-5 text-muted">
                            Aditya is a lifestyle coach, not a doctor or
                            dietitian. Any medical step is taken only under a
                            qualified physician.
                          </p>
                        )}
                      </article>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          </div>
          {/* Cross-link chip → /programs (method↔programs requirement) */}
          <Reveal className="mt-12 text-center md:mt-16">
            <Link
              href="/programs"
              className="type-small inline-flex min-h-[48px] items-center gap-2 rounded-full border border-hairline-gold px-6 font-medium text-gold-300 transition-colors hover:border-gold-500/60 hover:text-gold-200"
            >
              This is the order every program follows →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ 5. "WHY THE ORDER MATTERS" + MYTH vs TRUTH ============ */}
      <section className="cv-auto border-y border-hairline-soft bg-alt">
        <div className="container-site section">
          <div className="max-w-[720px]">
            <SplitHeading
              as="h2"
              text="Why the order matters."
              className="type-h2 text-primary"
            />
            <Reveal delayMs={100} className="reveal-blur mt-6 space-y-4">
              <p className="type-lead text-secondary">
                Anyone can hand you a diet. Anyone can sell you a pill.
              </p>{/* [review] */}
              <p className="type-lead text-secondary">
                The hard part isn&apos;t the pieces. It&apos;s the order you put
                them in.
              </p>{/* [review] */}
              <p className="type-lead text-secondary">
                Do it in the right order and each layer holds up the next. The
                change compounds. It lasts.
              </p>{/* [review] */}
              <p className="type-lead text-secondary">
                Do it in the wrong order and every layer sits on nothing.
                That&apos;s why it always falls apart. That&apos;s why
                you&apos;ve quit before.
              </p>{/* [review] */}
              <p className="type-lead text-primary">
                Same ingredients. Different order. Completely different life.
              </p>{/* [review] */}
            </Reveal>
          </div>

          <dl className="mt-12 flex flex-col md:mt-16">
            {MYTH_TRUTH.map((row, i) => (
              <div
                key={i}
                className="group grid gap-y-3 border-b border-hairline-soft px-3 py-6 transition-colors duration-300 first:border-t hover:bg-[rgba(201,162,75,0.04)] md:grid-cols-2 md:gap-x-10"
              >
                <Reveal
                  as="dt"
                  index={i}
                  className="reveal-left type-body text-muted"
                >
                  <span className="type-step mb-1 block text-muted">
                    Myth
                  </span>{/* [review] */}
                  &ldquo;{row.myth}&rdquo;
                </Reveal>
                <Reveal
                  as="dd"
                  delayMs={i * 100 + 150}
                  className="reveal-right type-body border-l-2 border-[var(--gold-500)] pl-4 text-primary transition-shadow duration-300 group-hover:[box-shadow:-6px_0_18px_-8px_rgba(201,162,75,0.5)]"
                >
                  <span className="type-step mb-1 block text-gold-500">
                    Truth
                  </span>{/* [review] */}
                  {row.truth}
                </Reveal>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ============ 6. MEDICAL / RESULTS DISCLAIMER STRIP (compliance) ============ */}
      <section className="bg-void">
        <div className="container-site py-8 md:py-10">
          {/* gold thread stitch above the compliance strip */}
          <div
            aria-hidden="true"
            className="thread-h sd-draw mx-auto mb-8 w-full max-w-[88ch]"
          />
          <p className="type-small mx-auto max-w-[88ch] text-center text-muted">
            Aditya is a lifestyle coach, not a doctor or registered dietitian.
            This method is general guidance, not medical advice, and individual
            results vary. Any medical step is taken only under a qualified
            physician. Consult a doctor before changing your health, diet or
            exercise.
          </p>
        </div>
      </section>

      {/* ============ 7. FINAL CTA BLOCK → /book (primary) + /tools (secondary) ============ */}
      <section className="aurora grain relative overflow-hidden border-t border-hairline-gold bg-surface-warm">
        <div
          className="container-site section relative z-10 flex flex-col items-center text-center"
          style={{ paddingBottom: 112 }}
        >
          <Reveal>
            <h2 className="type-h2 max-w-[22ch] text-primary">
              Get your order mapped in one call.
            </h2>{/* [review] */}
          </Reveal>
          <Reveal delayMs={100}>
            <p className="type-lead mt-4 max-w-xl text-secondary">
              Not a plan you&apos;ll quit. The exact order <em>your</em> body
              needs — in the right sequence.
            </p>{/* [review] */}
          </Reveal>
          <Reveal delayMs={200} className="mt-10">
            {/* VERBATIM brand close */}
            <p className="font-display mx-auto max-w-[24ch] text-xl text-primary md:text-2xl">
              The man you want to become is waiting for one decision.
            </p>
            <p className="type-body mx-auto mt-3 max-w-xl text-secondary">
              Start with a free blueprint. Or book a consultation today. Either
              way — start now.
            </p>
          </Reveal>
          <div className="cta-stack mt-9 justify-center">
            {/* primary lands last with an overshoot pop */}
            <Reveal
              delayMs={450}
              style={{ transitionTimingFunction: "var(--ease-overshoot)" }}
            >
              <Link href="/book" className="btn-gold shine-loop w-full md:w-auto">
                Get your order mapped — ₹2,000
              </Link>{/* [review] */}
            </Reveal>
            <Reveal delayMs={300}>
              <Link href="/tools" className="btn-outline w-full md:w-auto">
                Try the free calculator
              </Link>
            </Reveal>
          </div>
          <Reveal delayMs={550} className="mt-6">
            <a
              href={waLink(
                "Hi Aditya, I read The Right Order of Change and want to map my order." /* [review] */,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="type-small inline-flex min-h-[48px] items-center gap-2 font-medium text-wa transition-colors hover:text-wa-deep"
            >
              <WhatsAppIcon width={18} height={18} />
              Chat with Aditya
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
