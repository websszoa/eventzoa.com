import type { Metadata } from "next";

import PageDocument from "@/components/page/page-document";
import { operationDocument } from "@/lib/document";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: operationDocument.title,
  description: operationDocument.description,
  path: "/policy",
});

export default function PolicyPage() {
  return <PageDocument document={operationDocument} />;
}
