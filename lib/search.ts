export function normalizeSearchText(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase("ko-KR").replace(/\s+/g, "");
}
