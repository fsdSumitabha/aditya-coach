import Link from "next/link";
import Reveal from "@/components/Reveal";
import MidCta from "@/components/blog/MidCta";

/*
 * Post 3 — "Sleep, Habits and Drive: Getting It Back at 30-50."
 * (slug: sleep-habits-drive-men-30-50)
 *
 * Article inner content ONLY — the /blog/[slug] template owns the h1, cover,
 * meta line, end CTA, author box and related posts. Rendered inside
 * `.article-prose`, so headings start at h2 and elements are semantic.
 *
 * VERBATIM anchors (do not edit): the spec intro paragraph, the
 * "You built the career…" line, the founder-story pull-quote blockquote,
 * the MidCta body line, and the "The decision to change was the hardest
 * part. Everything else followed." testimonial echo. Everything else is
 * composed in Aditya's voice and tagged [review] for owner audit.
 */
export default function SleepHabitsDrive() {
  return (
    <>
      {/* Intro — spec-provided copy, VERBATIM (marked [review] in the master prompt) */}
      <p>
        You did everything right. Built the career. Made the money. Provided.
        And somewhere in all of it, you lost yourself. The energy is gone. The
        drive is gone. You look in the mirror and don&apos;t recognize the man
        staring back. I&apos;ve sat across from dozens of men just like you —
        successful on paper, running on empty in real life. Here&apos;s the
        good news: it comes back. Not with motivation. With sleep, habits and
        discipline, rebuilt in the right order. Let me show you how.
      </p>

      <Reveal as="section" className="space-y-[1.1em]">
        <h2 id="the-man-who-has-everything-and-feels-nothing">
          The man who has everything and feels nothing
        </h2>
        {/* Verbatim-adjacent anchor line per spec */}
        <p>
          You built the career. You made the money. But somewhere along the
          way you lost your health, your drive and your confidence.
        </p>
        <p>
          {/* [review] */}
          I meet this man every week. Late thirties, mid forties. Respected at
          work. Reliable at home. And privately flat. The salary went up and
          the energy went down, and nobody around him can see it — because on
          paper, nothing is wrong.
        </p>
        {/* Pull-quote — VERBATIM from the founder story */}
        <blockquote>
          That missing thing is always the same. Their health. Their drive.
          Their confidence. Their discipline.
        </blockquote>
        <p>
          {/* [review] */}
          Four things. Not one of them shows up on a bank statement. And all
          four of them are recoverable — if you rebuild them in the right
          order.
        </p>
      </Reveal>

      <Reveal as="section" className="space-y-[1.1em]">
        {/* [review] — section marked [review] in the outline */}
        <h2 id="why-drive-disappears-at-30-50">
          Why drive disappears at 30-50
        </h2>
        <p>
          Drive doesn&apos;t vanish overnight. It leaks out through five holes
          that most men never look at:
        </p>
        <ul>
          <li>
            <strong>Sleep debt.</strong> Ten years of six broken hours a
            night. Your hormones run on sleep — testosterone included. Starve
            the sleep and you starve the drive.
          </li>
          <li>
            <strong>Chronic stress.</strong> Not one bad week. A decade of
            deadlines, EMIs and responsibility with no release valve. Cortisol
            stays high, everything else stays low.
          </li>
          <li>
            <strong>Zero recovery.</strong> Even your weekends are errands.
            The body was never designed to run flat-out for twenty years
            without a pit stop.
          </li>
          <li>
            <strong>No daily structure.</strong> Your work is scheduled to the
            minute. Your life isn&apos;t. Random sleep, random meals, random
            everything — the body reads chaos and powers down.
          </li>
          <li>
            <strong>Cheap dopamine.</strong> The scroll, the late-night
            series, the third order-in of the week. Quick hits that spend the
            same currency real drive runs on.
          </li>
        </ul>
        <p>
          Notice something. None of those are fixed by a gym membership. All
          of them are lifestyle. Which is exactly why we start there.
        </p>
      </Reveal>

      <Reveal as="section" className="space-y-[1.1em]">
        <h2 id="sleep-is-the-foundation-fix-it-first">
          Sleep is the foundation — fix it first
        </h2>
        <p>
          {/* [review] */}
          If I could change only one thing in a tired man&apos;s life, it
          would be his sleep. Sleep is where testosterone is made, where
          stress is processed, where the day&apos;s damage gets repaired.
          Every other fix sits on top of it.
        </p>
        <p>
          {/* [review] — concrete sleep-first moves */}
          So we fix it first, and we fix it simply:
        </p>
        <ul>
          <li>
            A fixed sleep window — same time down, same time up, seven days a
            week. The body loves rhythm more than it loves duration.
          </li>
          <li>
            Screens off 30 minutes before bed. The phone charges outside the
            bedroom. Non-negotiable.
          </li>
          <li>
            Last coffee before 2 p.m. Caffeine at 6 p.m. is still in your
            blood at midnight.
          </li>
          <li>
            A dark, cool room. Boring advice. Works every single time.
          </li>
        </ul>
        <p>
          {/* [review] */}
          This is the &ldquo;lifestyle first&rdquo; order I use with every
          client:{" "}
          <Link href="/blog/lifestyle-first-why-most-diets-fail-men">
            fix how you live before you fix anything else
          </Link>
          . Sleep is layer one of layer one. Two weeks of a protected sleep
          window and most men feel a shift they haven&apos;t felt in years.
        </p>
      </Reveal>

      <Reveal as="section" className="space-y-[1.1em]">
        {/* [review] — section marked [review] in the outline */}
        <h2 id="the-daily-habits-that-rebuild-energy">
          The daily habits that rebuild energy
        </h2>
        <p>
          Once sleep is protected, we stack four daytime habits on top of it.
          Small ones. Deliberately small.
        </p>
        <ul>
          <li>
            <strong>A fixed wake time.</strong> The anchor for everything —
            hunger, mood, focus. One decision, made once.
          </li>
          <li>
            <strong>Morning light and movement.</strong> Ten minutes outside
            before the first meeting. Daylight in your eyes, blood moving.
            This sets the clock that sets the day.
          </li>
          <li>
            <strong>Protein at every meal.</strong> Tired men eat like
            teenagers — carbs, sugar, repeat. Protein steadies the energy
            curve so the 4 p.m. crash stops running your afternoons.
          </li>
          <li>
            <strong>A screen cut-off at night.</strong> The same habit that
            protects your sleep also kills the biggest cheap-dopamine leak in
            your day. Two wins, one rule.
          </li>
        </ul>
        <p>
          Small wins compound. A good night makes an easier morning. An easier
          morning makes a stronger day. A week of strong days and the mirror
          starts changing — before you&apos;ve touched a diet or a dumbbell.
          I&apos;ve put the full first layer into{" "}
          <Link href="/tools#blueprint">the free Lifestyle Blueprint</Link> —
          10 changes, start tonight.
        </p>
      </Reveal>

      {/* MID CTA — placed at the outline's marked point (after section 5) */}
      <Reveal>
        <MidCta
          eyebrow="One Call" /* [review] */
          heading="Stop guessing. Get the full picture." /* [review] */
          body="We map your lifestyle, health and goals. You leave with complete clarity."
          label="Book Your Transformation Audit"
          href="/book"
        />
      </Reveal>

      <Reveal as="section" className="space-y-[1.1em]">
        <h2 id="discipline-over-motivation">Discipline over motivation</h2>
        <p>
          Here is the part most men get backwards. You&apos;re waiting to feel
          motivated again before you start. You&apos;ll wait forever.
        </p>
        <p>
          Motivation is a feeling. Discipline is a system. Feelings show up
          when they want to. Systems show up every day. Systems survive bad
          days.
        </p>
        <p>
          {/* [review] */}
          You already know this — you&apos;ve run your career on it for twenty
          years. You don&apos;t attend Monday&apos;s meeting because you feel
          inspired. You attend because it&apos;s in the calendar. Your health
          gets rebuilt the same way: a fixed wake time, a protected sleep
          window, a ten-minute walk — in the calendar, not in the mood. Do the
          system long enough and the motivation you were waiting for shows up
          anyway. It follows action. It never leads it.
        </p>
      </Reveal>

      <Reveal as="section" className="space-y-[1.1em]">
        {/* [review] — section marked [review] in the outline */}
        <h2 id="a-30-day-reset-framework">A 30-day reset framework</h2>
        <p>
          Thirty days. One layer per week. Nothing added until the layer under
          it holds.
        </p>
        <ol>
          <li>
            <strong>Week 1 — Sleep window.</strong> Fixed bedtime, fixed wake
            time, screens off 30 minutes before bed. This week you change
            nothing else. Let the foundation set.
          </li>
          <li>
            <strong>Week 2 — Morning anchor.</strong> Ten minutes of daylight
            and movement before the day grabs you. Same time, every day. Your
            body starts expecting it — that expectation is energy.
          </li>
          <li>
            <strong>Week 3 — Movement.</strong> A daily walk, a short strength
            session at home, movement after your biggest meal. Not a gym
            program. Just a body that moves every day again.
          </li>
          <li>
            <strong>Week 4 — Accountability.</strong> Tell one person your
            system. Better: have one person check it. A plan nobody watches is
            a plan you&apos;ll quietly drop. This is half of what coaching is.
          </li>
        </ol>
        <p>
          Thirty days in, you haven&apos;t dieted, haven&apos;t bought a
          supplement, haven&apos;t signed up for anything extreme. And
          you&apos;re sleeping, moving and thinking like a different man. Now
          the deeper layers — nutrition, training, the finer work — finally
          have something to stand on.
        </p>
      </Reveal>

      <Reveal as="section" className="space-y-[1.1em]">
        {/* [review] — conclusion; closes on the Testimonial 1 echo */}
        <p>
          The drive you had at 25 isn&apos;t gone. It&apos;s buried — under a
          decade of bad sleep, no structure and running on empty for everyone
          else. It comes back. Not with motivation, not with a miracle plan.
          With sleep, habits and discipline, rebuilt in the right order.
        </p>
        <p>
          Every man I&apos;ve coached says a version of the same thing
          afterwards: the decision to change was the hardest part. Everything
          else followed.
        </p>
        <p>Make the decision. I&apos;ll show you the order.</p>
      </Reveal>
    </>
  );
}
