import type { Metadata } from "next";

import PageDocument from "@/components/page/page-document";
import { aboutDocument } from "@/lib/document";

export const metadata: Metadata = {
  title: aboutDocument.title,
  description: aboutDocument.description,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <PageDocument document={aboutDocument} />;
}
