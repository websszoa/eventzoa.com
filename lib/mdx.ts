export function createHeadingId(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[*_`]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractMdxHeadings(source: string) {
  return Array.from(source.matchAll(/^##\s+(.+)$/gm), ([, title]) => ({
    id: createHeadingId(title.trim()),
    title: title.trim().replace(/[*_`]/g, ""),
  }));
}

