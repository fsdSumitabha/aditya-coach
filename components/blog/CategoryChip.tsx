/**
 * Non-interactive category chip (gold-outline pill).
 * Used on index cards, the article hero and prev/next mini-cards.
 * Deliberately a <span>, never a link — keeps the stretched-link card free of
 * nested interactive elements (A2 accessibility requirement).
 */
export default function CategoryChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-hairline-gold px-3 py-1 font-body text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-gold-500">
      {label}
    </span>
  );
}
