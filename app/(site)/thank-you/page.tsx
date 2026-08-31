import type { Metadata } from "next";
import { Suspense } from "react";
import ThankYouContent, {
  ThankYouFallback,
} from "@/components/thank-you/ThankYouContent";
import { pageMetadata } from "@/lib/site";

/**
 * /thank-you — single confirmation page reused for every conversion.
 * /book payment redirects here with ?type=booking; lead magnets reuse it with
 * ?type=blueprint or ?type=split. Unknown/missing param → default state.
 *
 * useSearchParams lives in the client island, wrapped in <Suspense> (static-
 * export requirement); the fallback server-renders the default copy so the
 * confirmation content is present in HTML regardless of JS.
 */

export const metadata: Metadata = pageMetadata({
  title: "Thank You | Your Next Step With Aditya",
  description:
    "You're in. Check your WhatsApp and email for next steps. The decision was the hardest part. Everything else follows.",
  path: "/thank-you",
  noindex: true, // robots: noindex, nofollow (spec 0.6)
});

export default function ThankYouPage() {
  return (
    <div className="bg-void">
      <Suspense fallback={<ThankYouFallback />}>
        <ThankYouContent />
      </Suspense>
    </div>
  );
}
