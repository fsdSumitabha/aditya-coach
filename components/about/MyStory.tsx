"use client"
import Reveal from "@/components/Reveal";

function Chapter({
    num,
    label,
    center,
}: {
    num: string;
    label: string;
    center?: boolean;
}) {
    return (
        <div
            className={`flex items-center gap-4 ${center ? "justify-center" : ""}`}
        >
            <span className="font-display text-[1.5rem] leading-none text-gold-500">
                {num}
            </span>
            {/* the rule draws itself in as the chapter scrolls into view */}
            <span aria-hidden="true" className="thread-h sd-draw h-px w-10" />
            <span className="eyebrow">{label}</span>
        </div>
    );
}


export default function WhoThisIsFor() {
    return (
        <section
            className="bg-surface-1 grain aurora relative overflow-hidden border-y border-hairline-soft"
        >
            <div className="container-site section-lg">
                <h2 className="sr-only">The Founder Story</h2>

                {/* Editorial column: left-aligned prose so the drop cap reads as a
                      magazine opening. Copy VERBATIM — paragraph breaks pace it, words
                      unchanged; each body line blurs up on its own beat. */}
                <div className="mx-auto max-w-[60ch]">
                    <Reveal>
                        <Chapter num="01" label="THE STORY" />
                    </Reveal>

                    <Reveal
                        as="p"
                        index={0}
                        className="reveal-blur type-lead text-primary mt-10 leading-[1.7] first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[3.2em] first-letter:leading-[0.8] first-letter:text-gold-300"
                    >
                        I am not a celebrity trainer. I am not a gym influencer. I am
                        someone who rebuilt himself completely from the ground up.
                    </Reveal>
                    <Reveal as="p" index={1} className="reveal-blur type-lead text-primary mt-6 leading-[1.7]">
                        From 100kg with zero confidence to coaching some of the most
                        successful men in Kolkata.
                    </Reveal>
                    <Reveal as="p" index={2} className="reveal-blur type-lead text-primary mt-6 leading-[1.7]">
                        I have sat with businessmen, entrepreneurs and professionals who
                        had everything — and still felt like something was missing.
                    </Reveal>
                    <Reveal as="p" index={3} className="reveal-blur type-lead text-primary mt-6 leading-[1.7]">
                        That missing thing is always the same.
                    </Reveal>

                    {/* The four-noun punch — the page's loudest typographic moment */}
                    <Reveal delayMs={450} className="reveal-blur mt-10">
                        <p className="font-display border-l-2 border-gold-500 pl-6 text-[clamp(1.75rem,3.6vw,2.9rem)] leading-[1.25] text-gold-300">
                            Their health. Their drive. Their confidence. Their discipline.
                        </p>
                    </Reveal>

                    <Reveal delayMs={150} className="reveal-blur mt-8">
                        <p className="type-lead text-primary leading-[1.7]">
                            I help men get that back. Not with a crash diet. Not with a
                            supplement stack. With a complete lifestyle redesign that lasts
                            for the rest of their life.
                        </p>
                        <div className="mt-12">
                            <p className="font-display text-2xl italic text-gold-300">
                                — Aditya{/* [review] */}
                            </p>
                            <p className="type-caption mt-2 uppercase tracking-[0.18em] text-muted">
                                Aditya Kumar Upadhyay
                            </p>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    )
}