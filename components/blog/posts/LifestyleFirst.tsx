import Link from "next/link";
import Reveal from "@/components/Reveal";
import MidCta from "@/components/blog/MidCta";

/*
 * Post 1 — "Fix Your Lifestyle First: Why Most Diets Fail Men."
 * (slug: lifestyle-first-why-most-diets-fail-men)
 *
 * Article inner content ONLY — the /blog/[slug] template owns the h1, cover,
 * meta line, end CTA, author box and related posts. Rendered inside
 * `.article-prose`, so headings start at h2 and elements are semantic.
 *
 * [review] — All running prose beyond the spec's verbatim quotes (the intro
 * paragraph, the pull-quote, the Step 1 / Step 2 method copy and the
 * Blueprint promise line) is composed in Aditya's voice for owner audit.
 */
export default function LifestyleFirst() {
  return (
    <>
      {/* Intro — spec-provided copy, VERBATIM (marked [review] in the master prompt) */}
      <p>
        Most men start in the wrong place. They pick a diet. They pick a plan
        they saw online, go hard for three weeks — and then life happens, and
        it all falls apart. Here is the truth nobody tells you: the diet was
        never the problem. The way you live was. Your sleep. Your stress. Your
        daily habits. Fix those first and food gets easy. Skip them and no
        diet on earth will hold. This is the right order of change — and
        it&apos;s why the last five plans didn&apos;t stick.
      </p>

      <Reveal as="section" className="space-y-[1.1em]">
        <h2 id="why-most-diets-fail-men">Why most diets fail men</h2>
        <p>
          Think about the last plan you tried. Keto. Intermittent fasting. The
          1,200-calorie chart someone forwarded on WhatsApp. The plan was
          probably fine. It failed because of what it was sitting on.
        </p>
        <p>
          Five hours of broken sleep. Stress you carry home every night. Ten
          hours in a chair, then a screen till 1 a.m. That is the foundation
          most men hand their diet. Put any plan on top of that and it
          collapses. Every time.
        </p>
        <p>
          The collapse even has a schedule. Week one — all in, weighing food,
          feeling good. Week two — work gets heavy, two meals slip. Week three
          — one bad day becomes a bad weekend, and the guilt does the rest. By
          week four the plan is gone, and you blame yourself.
        </p>
        <p>
          You didn&apos;t lack discipline. You lacked a system. Motivation got
          you through three weeks — five times now. A system is what survives
          a bad month. And a system is built out of how you live, not what you
          eat.
        </p>
      </Reveal>

      <Reveal as="section" className="space-y-[1.1em]">
        <h2 id="the-right-order-of-change">The right order of change</h2>
        <p>
          A man&apos;s body changes in a fixed order. Skip a layer and
          everything above it wobbles.
        </p>
        <ol>
          <li>
            <strong>Lifestyle.</strong> Sleep, wake time, movement, daily
            habits. The foundation.
          </li>
          <li>
            <strong>Nutrition.</strong> What you eat, how much, how often.
            Only once the day around it is stable.
          </li>
          <li>
            <strong>Supplements.</strong> They fill the remaining gaps.
            Support — never a replacement.
          </li>
          <li>
            <strong>Medical.</strong> If needed. Always under a doctor. Always
            last.
          </li>
        </ol>
        <p>
          That&apos;s the whole model. Four layers, one at a time, each layer
          standing on the one below it. I&apos;ve broken down{" "}
          <Link href="/method">the full method here</Link> — but the short
          version is this:
        </p>
        {/* Pull-quote — VERBATIM per spec */}
        <blockquote>
          The weight was never the problem. The lifestyle was. Fix that — and
          the body follows.
        </blockquote>
      </Reveal>

      <Reveal as="section" className="space-y-[1.1em]">
        <h2 id="what-lifestyle-first-actually-means">
          What &ldquo;lifestyle first&rdquo; actually means
        </h2>
        <p>
          Lifestyle sounds vague. It isn&apos;t. It is four measurable things:
          When you wake up. How you sleep. How much you move. Your daily
          habits.
        </p>
        <p>
          A fixed wake time — weekends included. A sleep window your body can
          actually rely on. Steps and movement through the day, not just a gym
          hour you keep missing. And the small habits that run on autopilot:
          the midnight scrolling, the fourth coffee, the order-in dinners you
          don&apos;t even taste anymore.
        </p>
        <p>
          Notice what&apos;s missing. No diet chart. No calorie app. No banned
          foods. Not yet. This alone starts changing your body. Fix the sleep
          and the cravings drop on their own. Fix the mornings and the energy
          shows up before lunch instead of leaving at 4 p.m. Most men never
          learn this — because nobody sells it to them.
        </p>
      </Reveal>

      <Reveal as="section" className="space-y-[1.1em]">
        <h2 id="10-changes-that-rebuild-a-man">
          10 changes that rebuild a man
        </h2>
        <p>
          I&apos;ve put the entire first layer into one free download —{" "}
          <Link href="/tools#blueprint">the Lifestyle Blueprint</Link>: 10
          lifestyle changes that rebuild a man completely — body, mind and
          hormones. Start tonight.
        </p>
        <p>I won&apos;t dump all ten here. But a taste:</p>
        <ul>
          <li>
            A fixed wake time, seven days a week. One change, and your hunger,
            mood and energy start standing in line.
          </li>
          <li>
            A hard screen cut-off before bed. Tonight&apos;s sleep decides
            tomorrow&apos;s appetite.
          </li>
          <li>
            Movement after your biggest meal. Ten minutes. Small habit,
            oversized return.
          </li>
        </ul>
        <p>
          None of them cost money. None of them need a gym. Together they
          rebuild the foundation every diet you&apos;ve ever tried was
          missing.
        </p>
      </Reveal>

      {/* MID CTA — placed at the outline's marked point (after section 5) */}
      <Reveal>
        <MidCta
          heading="Want all ten?" /* [review] */
          body="10 lifestyle changes that rebuild a man completely. Start tonight."
          label="Get My Free Blueprint"
          href="/tools#blueprint"
        />
        <p className="type-small text-muted">
          {/* [review] — secondary link so the post touches both /tools and /book */}
          Prefer to talk it through first?{" "}
          <Link href="/book">Book a consultation</Link> and we&apos;ll map
          your order of change in one call.
        </p>
      </Reveal>

      <Reveal as="section" className="space-y-[1.1em]">
        {/* [review] — section marked [review] in the outline */}
        <h2 id="a-simple-7-day-starting-point">
          A simple 7-day starting point
        </h2>
        <p>
          Don&apos;t change everything on Monday. That is the three-week
          collapse wearing a new shirt. One change per day. That&apos;s it.
        </p>
        <ul>
          <li>
            <strong>Day 1:</strong> Pick your wake time. Set the alarm now.
          </li>
          <li>
            <strong>Day 2:</strong> Screens off 30 minutes before bed. Phone
            charges across the room.
          </li>
          <li>
            <strong>Day 3:</strong> A 15-minute walk. Any time, anywhere. No
            tracking. Just go.
          </li>
          <li>
            <strong>Day 4:</strong> Last coffee before 2 p.m.
          </li>
          <li>
            <strong>Day 5:</strong> Ten minutes of movement after your biggest
            meal.
          </li>
          <li>
            <strong>Day 6:</strong> Kill one autopilot habit — the midnight
            snack, the doom-scroll. Pick one. Just one.
          </li>
          <li>
            <strong>Day 7:</strong> Hold all six. Nothing new. Prove the week
            to yourself.
          </li>
        </ul>
        <p>
          By Sunday you haven&apos;t dieted for a single day — and you already
          feel different. That is the point. Execution beats perfection. The
          7-out-of-10 week you actually finish is worth more than the perfect
          plan you quit.
        </p>
      </Reveal>

      <Reveal as="section" className="space-y-[1.1em]">
        <h2 id="when-to-add-nutrition">When to add nutrition</h2>
        <p>So when does the diet start? Later than you think.</p>
        {/* Step 2 method copy — VERBATIM */}
        <p>
          Only after your lifestyle is stable do we look at what you eat. Not
          before. Never before. Food changes that actually last.
        </p>
        <p>
          Stable means the wake time, the sleep window and the daily movement
          have held for two or three weeks without a fight. Once the day
          around your food is calm, food stops being a war. Then we adjust how
          much you eat, how often, and the handful of foods doing the real
          damage — and this time it holds, because there is finally something
          underneath it.
        </p>
      </Reveal>

      {/* Conclusion — no heading of its own, so no <section> landmark. [review] */}
      <Reveal className="space-y-[1.1em]">
        <p>You don&apos;t need a stricter diet. You need a better order.</p>
        <p>
          Fix how you live. Then fix how you eat. Then — and only then — the
          finer layers. The body follows. It always does.
        </p>
        <p>
          The information was never the hard part. The decision is. Make it
          tonight — your wake time is waiting.
        </p>
      </Reveal>
    </>
  );
}
