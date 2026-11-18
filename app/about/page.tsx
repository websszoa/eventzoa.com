import type { Metadata } from "next";

import PageDocument from "@/components/page/page-document";
import { aboutDocument } from "@/lib/document";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: aboutDocument.title,
  description: aboutDocument.description,
  path: "/about",
});

export default function AboutPage() {
  return <PageDocument document={aboutDocument} />;
}
