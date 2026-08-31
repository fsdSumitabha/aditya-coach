import type { Metadata } from "next";
import AuditFlow from "@/components/audit/AuditFlow";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "The Transformation Audit | Aditya Kumar Upadhyay",
  description:
    "The form to fill in before coaching starts. Eleven short sections on your lifestyle, body, habits and personality. Fill it in once and it goes straight to Aditya.", /* [review] */
  path: "/audit",
  // Client intake, not a landing page: it is handed out by link, and an
  // indexed half-finished form would compete with /book in search.
  noindex: true,
});

export default function AuditPage() {
  return <AuditFlow />;
}
