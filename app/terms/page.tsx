import type { Metadata } from "next";

import PageDocument from "@/components/page/page-document";
import { termsDocument } from "@/lib/document";

export const metadata: Metadata = {
  title: termsDocument.title,
  description: termsDocument.description,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <PageDocument document={termsDocument} />;
}
