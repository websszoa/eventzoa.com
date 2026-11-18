import type { Metadata } from "next";

import PageDocument from "@/components/page/page-document";
import { privacyDocument } from "@/lib/document";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: privacyDocument.title,
  description: privacyDocument.description,
  path: "/privacy",
});

export default function PrivacyPage() {
  return <PageDocument document={privacyDocument} />;
}
