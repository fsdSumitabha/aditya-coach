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
  ICON_STEP5,
} from "@/components/method/method-assets";

// ============================================================
// BUILD SPEC — /method — "The Method" (The Complete Rebuild, in the Right Order)
// ============================================================

export const metadata: Metadata = pageMetadata({
  title: "The Right Order of Change | Method for Men",
  description:
    // [review] — natural men's-transformation keywords, five-step framing
    "The Complete Rebuild for men: lifestyle, body, nutrition, performance, then presence — built in the exact order that makes change last. Aditya's men's transformation method.",
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
    name: "Lifestyle",
    Icon: ICON_STEP1,
    body: "Fix how you live.", // VERBATIM
    depth: [
      { lead: "What we change:", text: "When you sleep and when you wake. How much you move. The daily habits running on autopilot. How you handle stress and how you recover." } /* [review] */,
      { lead: "Why it's first:", text: "This is the ground everything else stands on. Fix how a man lives and his body starts changing before he's touched a barbell or his diet." } /* [review] */,
      { lead: "Skip it and:", text: "every layer above collapses. You can't out-train broken sleep. You can't out-eat a life that's falling apart." } /* [review] */,
    ],
  },
  {
    id: "step-2",
    num: "02",
    name: "Body",
    Icon: ICON_STEP2,
    body: "Build strength, fitness, and physical confidence.", // VERBATIM
    depth: [
      { lead: "What we build:", text: "Real strength. Everyday fitness. The training foundations that make hard work feel normal instead of punishment." } /* [review] */,
      { lead: "Why it's second:", text: "Once the day around you is stable, the body can take load and actually adapt. Strength built on a solid life stays." } /* [review] */,
      { lead: "What you get:", text: "A body that can do things — and the physical confidence that comes with it. That doesn't come from a mirror. It comes from what you can do." } /* [review] */,
    ],
  },
  {
    id: "step-3",
    num: "03",
    name: "Nutrition",
    Icon: ICON_STEP3,
    body: "Fuel your body properly.", // VERBATIM
    depth: [
      { lead: "What we change:", text: "How much you eat, how often, and the few foods doing the most damage. Eating for the body you actually want. No crash diet. No banned list you'll quit in a week." } /* [review] */,
      { lead: "Why it comes here:", text: "Food only holds once the life and the training around it hold it in place. Not before. Never before." } /* [review] — reuses verbatim fragment "Not before. Never before." */,
      { lead: "Skip the foundation and:", text: "you get the same result you always got — three good weeks, then back to square one." } /* [review] */,
    ],
  },
  {
    id: "step-4",
    num: "04",
    name: "Performance",
    Icon: ICON_STEP4,
    body: "Improve training, recovery, energy, and performance.", // VERBATIM
    depth: [
      { lead: "What we sharpen:", text: "How you recover. Your energy across the day. The quality of every session — so the work you put in actually pays you back." } /* [review] */,
      { lead: "Where supplements fit:", text: "Right here, as guidance — not a shortcut. A short, honest list that fills a real gap once the food is right. Never a cabinet full of tubs." } /* [review] */,
      { lead: "Why it's this late:", text: "Performance is the finishing layer. It works because there's already a foundation under it to sharpen." } /* [review] */,
    ],
  },
  {
    id: "step-5",
    num: "05",
    name: "Presence",
    Icon: ICON_STEP5,
    body: "Improve how you communicate, carry yourself, and show up.", // VERBATIM
    depth: [
      { lead: "What we build:", text: "Body language. The way you communicate. Grooming and style that fit the man you've become. How you show up the moment you walk into a room." } /* [review] */,
      { lead: "Why it's last:", text: "You earn it. Once the body is rebuilt, presence is what makes the change land on everyone who meets you. It's the finish, not the foundation." } /* [review] */,
      { lead: "The full picture:", text: "This is the part most coaching never reaches — the part that decides how the world reads you before you've said a word." } /* [review] */,
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
  name: "The Complete Rebuild — The Right Order of Change",
  description:
    "Lifestyle, then body, then nutrition, then performance, then presence — the exact order Aditya uses to build change in men that actually lasts.",
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

      {/* ============ 3. FOUNDATION-STACK VISUAL (Lifestyle base → Presence top) ============ */}
      <section
        id="foundation-stack"
        className="border-y border-hairline-soft bg-alt"
      >
        {/* Real-text equivalent for assistive tech — the stack below is decorative */}
        <p className="sr-only">
          The Complete Rebuild, from the base up: Lifestyle at the foundation,
          then Body, then Nutrition, then Performance, with Presence at the top.
        </p>
        {/* Showpiece: sticky-pinned scene, tiers assemble bottom-up on scroll */}
        <FoundationStack />
      </section>

      {/* Decorative ticker — verbatim layer labels bridging into the five steps */}
      <div className="border-b border-hairline-soft bg-void py-6 md:py-8">
        <Marquee
          items={["Lifestyle", "Body", "Nutrition", "Performance", "Presence"]}
          speedS={34}
        />
      </div>

      {/* ============ 4. FIVE EXPANDED STEP SECTIONS (01 → 05) ============ */}
      {/* Sticky numeral rail (desktop) lights the active step as you read */}
      <StepRail />
      <section className="cv-auto bg-base">
        <div className="container-site section">
          {/* THE COMPLETE REBUILD — the framework, rebranded (H1 above stays) */}
          <Reveal className="mb-12 max-w-[720px] md:mb-16">
            <div className="flex items-center gap-4">
              <span aria-hidden="true" className="thread-h sd-draw h-px w-14" />
              <p className="eyebrow">THE COMPLETE REBUILD</p>
            </div>
            <SplitHeading
              as="h2"
              text="Five layers. One order."
              className="type-h2 text-primary mt-4"
            />
            <p className="type-lead mt-5 text-secondary">
              Most men attack one piece and wonder why nothing holds. The
              complete rebuild runs all five — in the order that makes each one
              stick.
            </p>{/* [review] */}
          </Reveal>
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
                        {step.id === "step-3" && (
                          <Link
                            href="/tools#calculator"
                            className="type-small mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-full border border-hairline-gold px-5 font-medium text-gold-300 transition-colors hover:border-gold-500/60 hover:text-gold-200"
                          >
                            See how much you should actually eat →
                          </Link>
                        )}
                        {step.id === "step-4" && (
                          <p className="type-small mt-5 text-muted">
                            {/* [review] — supplements are guidance; medical stays a doctor-led last resort */}
                            Supplements are guidance, not a prescription. Any
                            medical or clinical step is a last resort, taken only
                            under a qualified doctor.
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

      {/* ============ 5b. POSITIONING — WHO THE COMPLETE REBUILD IS FOR ============ */}
      <section className="cv-auto aurora grain relative overflow-hidden border-t border-hairline-soft bg-surface-warm">
        <div className="container-site section text-center">
          <Reveal>
            <p className="eyebrow">WHO THIS IS FOR{/* [review] */}</p>
          </Reveal>
          {/* verbatim from Aditya's brief */}
          <SplitHeading
            as="h2"
            text="A strong body should be matched with a strong presence."
            className="type-h2 text-primary mx-auto mt-4 max-w-[24ch]"
          />
          <Reveal delayMs={150} className="reveal-blur mx-auto mt-6 max-w-[58ch]">
            {/* verbatim from Aditya's brief (§1) */}
            <p className="type-lead text-secondary">
              There is no point in having a six-pack if you still look at your
              shoes when you enter a room.
            </p>
            <p className="type-body text-secondary mt-4">
              {/* [review] — positioning, not a repeat of step 05 */}
              This is for the man who&apos;s done with quick fixes — who wants
              the whole thing rebuilt, in the right order, and built to last.
              Not a workout plan. A different life.
            </p>
          </Reveal>
          <Reveal delayMs={250} className="mt-8">
            <Link href="/programs" className="btn-outline">
              See Complete Transformation
            </Link>
          </Reveal>
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
              Start with a free blueprint. Or book your Transformation Audit today. Either
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
                Book Your Transformation Audit
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
