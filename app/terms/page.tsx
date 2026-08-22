import type { Metadata } from "next";

import PageDocument from "@/components/page/page-document";
import { termsDocument } from "@/lib/document";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: termsDocument.title,
  description: termsDocument.description,
  path: "/terms",
});

export default function TermsPage() {
  return <PageDocument document={termsDocument} />;
}
