import Link from "next/link";
import Reveal from "@/components/Reveal";
import MidCta from "@/components/blog/MidCta";

/*
 * Post 2 — "How Much Should a Man Actually Eat to Lose Fat?"
 * (slug: how-much-should-a-man-eat-to-lose-fat)
 *
 * Article inner content ONLY — the /blog/[slug] template owns the h1, cover,
 * meta line, end CTA (calculator-primary), author box and related posts.
 * Rendered inside `.article-prose`, so headings start at h2.
 *
 * Copy discipline (per spec): "same starting framework" — NEVER "exact
 * formula". The worked example is framed as illustrative, not a rule.
 *
 * [review] — All running prose beyond the spec's verbatim pieces (the intro
 * paragraph and the bridge blockquote) is composed in Aditya's voice for
 * owner audit; the outline's explicitly-marked [review] spots are tagged
 * inline below.
 */
export default function HowMuchToEat() {
  return (
    <>
      {/* Intro — spec-provided copy, VERBATIM (marked [review] in the master prompt) */}
      <p>
        Most men are guessing. They eat too little on Monday, too much by
        Friday, and wonder why nothing moves. Here is what almost no one
        explains: you are probably eating for the body you already have — not
        the body you actually want. Those are two different numbers. In this
        article I&apos;ll give you a simple starting framework for calories
        and protein. Not a crash diet. A number you can build on — and a free
        calculator that does the math for you in ten seconds.
      </p>

      <Reveal as="section" className="space-y-[1.1em]">
        <h2 id="why-just-eat-less-is-bad-advice">
          Why &ldquo;just eat less&rdquo; is bad advice
        </h2>
        <p>
          It sounds logical. Eat less, lose fat. So you cut hard — skip
          breakfast, salad for lunch, black coffee to push through. And for a
          week or two, the scale moves.
        </p>
        <p>
          Then your body pushes back. Under-eat long enough and your energy
          drops, your sleep gets restless, your training turns flat, and your
          drive — in the gym and outside it — quietly disappears. You feel it
          before you can name it. The 4 p.m. crash. The short temper. The
          workout you keep postponing.
        </p>
        <p>
          And a starving body doesn&apos;t stay obedient. It negotiates.
          One heavy dinner becomes a heavy weekend, the guilt kicks in, you
          cut even harder on Monday — and the cycle restarts. That is the
          yo-yo trap, and it is not a discipline problem. It is a numbers
          problem. Too little is just as much a mistake as too much.
        </p>
        <p>
          You don&apos;t need to eat less. You need to eat the{" "}
          <em>right amount</em> — and almost no one has ever told you what
          that number is.
        </p>
      </Reveal>

      <Reveal as="section" className="space-y-[1.1em]">
        <h2 id="eat-for-the-body-you-want">
          Eat for the body you WANT, not the one you have
        </h2>
        <p>Here is the shift that changes everything:</p>
        {/* Bridge quote — VERBATIM per spec */}
        <blockquote>
          Most men are eating for the body they currently have. You should be
          eating for the body you want to have.
        </blockquote>
        <p>
          Think about what your daily food is actually doing. If you eat what
          maintains your current weight, you maintain your current weight.
          That is the whole story of the man who &ldquo;doesn&apos;t eat that
          much&rdquo; and still doesn&apos;t change — his intake matches the
          body he already has, so the body stays.
        </p>
        <p>
          The alternative is ideal-weight targeting. Instead of feeding the
          90&nbsp;kg version of you, you feed the version you are building —
          the weight you actually want to walk around at. Eat like that man
          every day, and your body has no choice but to move toward him.
          Steadily. Without starving. Without the yo-yo.
        </p>
        <p>
          Two different numbers. Most men have only ever known the first one.
        </p>
      </Reveal>

      <Reveal as="section" className="space-y-[1.1em]">
        <h2 id="a-simple-starting-framework">A simple starting framework</h2>
        <p>
          So how do you find the second number? You scale your calories to
          your <strong>ideal</strong> bodyweight — the weight you want to be,
          not the weight you are. Your activity level adjusts it up or down:
          a man training four days a week needs more than a man at a desk all
          day, at the same target weight.
        </p>
        <p>
          Protein is anchored the same way: around{" "}
          <strong>2&nbsp;g per kg of your ideal weight</strong>, every day.
          Ideal weight — not current weight. You are feeding the muscle of
          the body you are building, not the fat of the one you are leaving.
        </p>
        <p>
          Two things to be clear about. First — this is a{" "}
          <em>starting framework</em>, not a medical prescription. It gives
          you a sane first number instead of a guess; it does not replace a
          doctor. Second — you don&apos;t have to work any of this out by
          hand. My{" "}
          <Link href="/tools#calculator">free calorie calculator</Link>{" "}
          applies the same starting framework automatically: current weight,
          ideal weight, activity level — and it shows you both numbers, plus
          the gap between them, in ten seconds.
        </p>
      </Reveal>

      <Reveal as="section" className="space-y-[1.1em]">
        {/* [review] — section marked [review] in the outline (practical food examples) */}
        <h2 id="protein-the-number-most-men-get-wrong">
          Protein: the number most men get wrong
        </h2>
        <p>
          If you only track one thing, track protein. It is the anchor of the
          whole framework. Enough protein protects your muscle while the fat
          comes off, keeps you full so the cravings lose their grip, and
          costs your body more energy to digest than anything else on your
          plate. Get protein right and the rest of your diet gets remarkably
          forgiving.
        </p>
        <p>
          Most men eat half of what they need. Toast for breakfast, rice and
          dal for lunch, biscuits with evening chai — a full day can pass
          with barely 50&nbsp;g of protein in it.
        </p>
        <p>What real numbers look like on a plate:</p>
        <ul>
          <li>
            <strong>Eggs:</strong> about 6&nbsp;g each. Three at breakfast is
            ~18&nbsp;g before you leave the house.
          </li>
          <li>
            <strong>Chicken breast:</strong> roughly 30&nbsp;g per 100&nbsp;g
            cooked. One solid serving at lunch and one at dinner does the
            heavy lifting.
          </li>
          <li>
            <strong>Paneer:</strong> around 18&nbsp;g per 100&nbsp;g — the
            vegetarian workhorse.
          </li>
          <li>
            <strong>Dal:</strong> useful, but modest — a bowl gives you
            7–9&nbsp;g. It supports the total; it can&apos;t carry it.
          </li>
          <li>
            <strong>Fish, curd, whey:</strong> fish ~22&nbsp;g per
            100&nbsp;g; a scoop of whey ~24&nbsp;g when the day falls short.
          </li>
        </ul>
        <p>
          Spread it across three or four meals, put a protein source at the
          centre of each plate, and the target stops being intimidating. It
          becomes arithmetic.
        </p>
      </Reveal>

      {/* MID CTA — placed at the outline's marked point (after the protein section) */}
      <Reveal>
        <MidCta
          heading="Stop guessing. Get your number." /* [review] */
          body="Get a starting estimate of how much you should be eating."
          label="Try the Calorie Calculator"
          href="/tools#calculator"
        />
      </Reveal>

      <Reveal as="section" className="space-y-[1.1em]">
        {/* [review] — section marked [review] in the outline (illustrative example) */}
        <h2 id="a-worked-example">A worked example</h2>
        <p>
          Let&apos;s make it concrete — as an example, not a rule. Take a man
          around 90&nbsp;kg whose ideal weight is around 75&nbsp;kg, training
          three to four times a week.
        </p>
        <p>
          Eating for the body he <em>has</em>, his day lands well above
          3,000&nbsp;kcal — that is roughly what maintains 90&nbsp;kg at his
          activity level. Eating for the body he <em>wants</em>, the same
          starting framework points to a target near{" "}
          <strong>~2,650&nbsp;kcal a day</strong> — a gap of several hundred
          calories, every single day, without ever feeling like a crash diet.
        </p>
        <p>
          His protein? Around <strong>150&nbsp;g a day</strong> —
          2&nbsp;g per kg of the 75&nbsp;kg he is building toward.
        </p>
        <p>
          Notice what this is: a clear, livable daily target with real food
          on the plate — not 1,200 starvation calories. The point of the
          example is the <em>difference</em> between the two numbers. Your
          own weights, your own activity level, your own gap — that is
          exactly what the calculator works out for you.
        </p>
      </Reveal>

      <Reveal as="section" className="space-y-[1.1em]">
        <h2 id="your-number-is-a-starting-point">
          Your number is a starting point, not a law
        </h2>
        <p>
          No framework knows your body on day one. Yours is the first draft —
          the real answer comes from running it against reality.
        </p>
        <p>
          So run it for two to three weeks, honestly, and watch what actually
          happens. Weight trending down half a kilo or so a week, energy
          steady, training strong? The number is working — leave it alone.
          Nothing moving after three weeks? Take a couple of hundred calories
          off and run it again. Feeling drained, sleeping badly, dreading the
          gym? You may have cut too hard — add a little back.
        </p>
        <p>
          Adjust by results, not by mood. Small moves, held for weeks. That
          is how a starting estimate becomes <em>your</em> number.
        </p>
        {/* Inline medical/estimate disclaimer — VERBATIM per outline item 9 */}
        <p className="type-small text-muted">
          This is a general estimate, not medical advice. Aditya is a coach,
          not a doctor or registered dietitian. Consult a qualified physician
          before changing your diet.
        </p>
      </Reveal>

      <Reveal as="section" className="space-y-[1.1em]">
        <p>
          You have spent enough Mondays guessing. Guessing is why nothing has
          moved.
        </p>
        <p>
          So stop. Get your number — the calculator takes ten seconds. Then
          execute it, every day, for three weeks before you judge it. Eat for
          the body you want. It is already waiting on the other side of a
          number you now know how to find.
        </p>
        <p className="type-small text-muted">
          {/* [review] — bridge line into /book so the post closes on both funnel paths */}
          And if you want the full plan built around your numbers — food,
          lifestyle, the whole order of change —{" "}
          <Link href="/book">book a consultation</Link>. Same starting
          framework. Built around you.
        </p>
      </Reveal>
    </>
  );
}
