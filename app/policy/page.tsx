import type { Metadata } from "next";

import PageDocument from "@/components/page/page-document";
import { operationDocument } from "@/lib/document";

export const metadata: Metadata = {
  title: operationDocument.title,
  description: operationDocument.description,
  alternates: { canonical: "/policy" },
};

export default function PolicyPage() {
  return <PageDocument document={operationDocument} />;
}
