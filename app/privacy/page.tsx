import type { Metadata } from "next";

import PageDocument from "@/components/page/page-document";
import { privacyDocument } from "@/lib/document";

export const metadata: Metadata = {
  title: privacyDocument.title,
  description: privacyDocument.description,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <PageDocument document={privacyDocument} />;
}
