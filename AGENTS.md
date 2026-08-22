<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# EventZoa project conventions

## Component naming

- Files in `components/page/` must use the `page-` prefix and kebab-case, such as `page-header.tsx` and `page-contact-form.tsx`.
- Files in `components/main/` must use the `main-` prefix and kebab-case.
- React component names remain PascalCase even when their filenames use kebab-case.
- Shared primitives in `components/ui/` follow the shadcn component names and do not need a `page-` or `main-` prefix.

## Typography

- Use `font-cafe24` for large display text and prominent headings such as page titles, section titles, card titles, and article headings.
- Use the NanumSquare Neo font for body copy, labels, inputs, buttons, navigation, metadata, and other general UI text. The global `font-sans` already maps to NanumSquare Neo, so prefer inheriting it; use `font-nanum` only when an explicit class is needed.
- Do not use Cafe24 for long body copy or form controls.

## Visual design

- Do not use shadow effects, including Tailwind `shadow-*` and `drop-shadow-*` utilities.
- Separate surfaces with borders, rings, background colors, spacing, and typography instead of shadows.
- Keep the established EventZoa palette: blue for primary actions and active states, slate for neutral text and borders, and restrained pastel backgrounds for supporting emphasis.
- Use rounded surfaces consistently with the surrounding page instead of introducing a new visual style.
- Use Tailwind CSS v4 canonical utilities, such as `bg-linear-to-*` and spacing utilities like `w-0.75`, rather than deprecated or unnecessarily arbitrary syntax.
