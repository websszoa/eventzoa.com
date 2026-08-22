"use client";

import Link from "next/link";
import { ArrowRight, FileCheck2 } from "lucide-react";
import { useEffect, useState } from "react";

import type { DocumentBlock, ServiceDocument } from "@/lib/document";

export default function PageDocument({
  document,
}: {
  document: ServiceDocument;
}) {
  const [activeSection, setActiveSection] = useState(
    document.sections[0]?.id ?? "",
  );

  useEffect(() => {
    let frame = 0;

    function updateActiveSection() {
      const activationLine = 160;
      let currentSection = document.sections[0]?.id ?? "";

      for (const section of document.sections) {
        const element = window.document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= activationLine) {
          currentSection = section.id;
        }
      }

      setActiveSection(currentSection);
    }

    function handleScroll() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveSection);
    }

    frame = requestAnimationFrame(updateActiveSection);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [document.sections]);

  return (
    <>
      <section className="bg-linear-to-br from-sky-50 via-blue-50/40 to-white">
        <div className="container py-14 sm:py-18 lg:py-16">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-white text-blue-600 ring-1 ring-blue-200">
            <FileCheck2 className="size-6" aria-hidden="true" />
          </div>
          <p className="mt-6 text-sm font-bold tracking-widest text-blue-600 uppercase">
            {document.englishTitle}
          </p>
          <h1 className="mt-2 font-cafe24 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            {document.title}
          </h1>
          <p className="mt-5 break-keep text-[15px] leading-7 text-slate-600">
            {document.description}
          </p>
          <p className="mt-5 text-sm text-slate-400">
            시행일: {document.effectiveDate}
          </p>
        </div>
      </section>
      <section className="bg-white py-10 sm:py-16">
        <div className="container grid items-start gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-28">
            <div>
              <p className="font-cafe24 text-2xl font-bold text-slate-950">
                목차
              </p>
              <nav aria-label={`${document.title} 목차`}>
                <ol className="mt-7 border-l border-slate-200 py-0.5">
                  {document.sections.map((section) => {
                    const isActive = activeSection === section.id;

                    return (
                    <li
                      key={section.id}
                      className={`relative before:absolute before:top-0 before:-left-px before:h-full before:w-0.75 before:bg-blue-500 before:transition-opacity ${isActive ? "before:opacity-100" : "before:opacity-0"}`}
                    >
                      <a
                        href={`#${section.id}`}
                        aria-current={isActive ? "location" : undefined}
                        onClick={() => setActiveSection(section.id)}
                        className={`block break-keep py-1.5 pl-4 text-sm leading-6 transition-colors hover:text-blue-500 ${isActive ? "font-medium text-blue-500" : "text-slate-500"}`}
                      >
                        {section.title}
                      </a>
                    </li>
                    );
                  })}
                </ol>
              </nav>
            </div>
          </aside>
          <article className="min-w-0 max-w-4xl">
            <div className="space-y-12 text-[15px] leading-7 text-slate-600">
              {document.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28"
                >
                  <h2 className="mb-4 font-cafe24 text-2xl font-bold text-slate-950 sm:text-3xl">
                    {section.title}
                  </h2>
                  <div className="space-y-3">
                    {section.blocks.map((block, index) => (
                      <DocumentBlockView
                        key={`${section.id}-${index}`}
                        block={block}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
            <div className="mt-14 border-t border-slate-200 pt-8">
              <p className="text-sm text-slate-500">{document.inquiryLabel}</p>
              <Link
                href="/contact"
                className="mt-3 inline-flex items-center gap-2 font-bold text-blue-600 transition-colors hover:text-blue-800"
              >
                문의 페이지로 이동
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}

function DocumentBlockView({ block }: { block: DocumentBlock }) {
  if (block.type === "paragraph")
    return <p className="break-keep">{block.text}</p>;
  const List = block.type === "ordered" ? "ol" : "ul";
  return (
    <List
      className={`${block.type === "ordered" ? "list-decimal" : "list-disc"} space-y-1 pl-5`}
    >
      {block.items.map((item) => (
        <li key={item} className="break-keep">
          {item}
        </li>
      ))}
    </List>
  );
}
