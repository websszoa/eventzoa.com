import Link from "next/link";
import { footerMenu, socialLinks } from "@/lib/navigation";

import {
  APP_COPYRIGHT,
  APP_DESCRIPTION,
  APP_NAME,
  APP_SLOGAN,
} from "@/lib/constants";

export default function PageFooter() {
  return (
    <footer id="site-footer" className="border-t border-gray-100 bg-gray">
      <div className="container py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_2.1fr] lg:gap-26">
          <div className="max-w-sm">
            <Link
              href="/"
              aria-label={`${APP_NAME} 홈`}
              className="font-heading font-cafe24 text-3xl leading-none font-black text-blue-700 tracking-[-0.06em] uppercase"
            >
              {APP_NAME}
            </Link>
            <p className="mt-5 text-sm leading-6 text-slate-800 break-keep">
              {APP_DESCRIPTION}
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    social.href.startsWith("http") ? "noreferrer" : undefined
                  }
                  aria-label={`${APP_NAME} ${social.label}`}
                  className="flex size-11 items-center justify-center rounded-md border bg-background text-muted-foreground transition-colors hover:text-primary"
                >
                  <svg
                    aria-hidden="true"
                    className="size-4"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d={social.path} />
                  </svg>
                </Link>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 xl:grid-cols-4 xl:gap-x-16">
            {footerMenu.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h2 className="font-heading text-xl font-semibold">
                  {group.title}
                </h2>
                <ul className="mt-4 space-y-1.5">
                  {group.links.map((link) => {
                    const isExternal = link.href.startsWith("http");

                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          target={isExternal ? "_blank" : undefined}
                          rel={isExternal ? "noreferrer" : undefined}
                          className="inline-flex items-center text-sm text-slate-800 transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center gap-2 border-t pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:gap-3 sm:text-left">
          <p>{APP_COPYRIGHT}</p>
          <p>{APP_SLOGAN}</p>
        </div>
      </div>
    </footer>
  );
}
