import "server-only";

import { existsSync, statSync } from "node:fs";
import path from "node:path";

import { APP_IMAGE_URL } from "@/lib/constants";

const coverExtensions = ["webp", "avif", "jpg", "jpeg", "png"];

export function getEventCoverPath(slug: string) {
  for (const extension of coverExtensions) {
    const publicPath = `/event/cover/${slug}.${extension}`;
    const filePath = path.join(process.cwd(), "public", publicPath);

    if (existsSync(filePath)) {
      const version = Math.trunc(statSync(filePath).mtimeMs);
      return `${APP_IMAGE_URL}/${slug}.${extension}?v=${version}`;
    }
  }

  return null;
}
