import "server-only";

import { existsSync, statSync } from "node:fs";
import path from "node:path";

const coverExtensions = ["jpg", "jpeg", "png", "webp", "avif"];

export function getEventCoverPath(slug: string) {
  for (const extension of coverExtensions) {
    const publicPath = `/event/cover/${slug}.${extension}`;
    const filePath = path.join(process.cwd(), "public", publicPath);

    if (existsSync(filePath)) {
      const version = Math.trunc(statSync(filePath).mtimeMs);
      return `${publicPath}?v=${version}`;
    }
  }

  return null;
}
