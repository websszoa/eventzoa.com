import Image from "next/image";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { createHeadingId } from "@/lib/mdx";
import {
  formatNotificationDate,
  notificationCategoryLabels,
  type NotificationPost,
} from "@/lib/notifications";

export default async function PageNotificationArticle({
  post,
  backHref,
}: {
  post: NotificationPost;
  backHref: string;
}) {
  const content = await compileMDX({
    source: post.source,
    components: mdxComponents,
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
  });

  return (
    <article className="p-6 sm:p-8 lg:p-10">
      <Link href={backHref} className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-blue-600">
        <ArrowLeft className="size-4" aria-hidden="true" />
        목록으로 돌아가기
      </Link>
      <Badge className="mt-4 flex h-6 w-fit items-center justify-center rounded-full bg-blue-600 px-3 text-white">
        {notificationCategoryLabels[post.category]}
      </Badge>
      <h1 className="mt-5 break-keep font-cafe24 text-4xl leading-tight font-bold text-slate-950 sm:text-5xl">{post.title}</h1>
      <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-700">
        <span className="flex items-center gap-1.5"><CalendarDays className="size-4" aria-hidden="true" />{formatNotificationDate(post.publishedAt)}</span>
        <span className="flex items-center gap-1.5"><Clock3 className="size-4" aria-hidden="true" />읽는 시간 {post.readingTime}</span>
      </div>
      <div className="mt-9 border-t border-slate-200 pt-9 text-[16px] leading-8 text-slate-700">{content.content}</div>
    </article>
  );
}

const mdxComponents = {
  h2: ({ children, ...props }: React.ComponentProps<"h2">) => (
    <h2 id={createHeadingId(String(children))} className="mt-10 mb-4 scroll-mt-28 font-cafe24 text-3xl font-bold text-slate-950" {...props}>{children}</h2>
  ),
  h3: (props: React.ComponentProps<"h3">) => <h3 className="mt-8 mb-3 font-cafe24 text-2xl font-bold text-slate-950" {...props} />,
  p: (props: React.ComponentProps<"p">) => <p className="mb-6 break-keep" {...props} />,
  img: ({ src, alt = "" }: React.ComponentProps<"img">) => (
    <Image src={typeof src === "string" ? src : ""} alt={alt} width={1672} height={941} sizes="(min-width: 1024px) 850px, 100vw" className="my-8 h-auto w-full rounded-3xl object-cover ring-1 ring-slate-200" />
  ),
  ul: (props: React.ComponentProps<"ul">) => <ul className="mb-6 list-disc space-y-2 pl-6" {...props} />,
  ol: (props: React.ComponentProps<"ol">) => <ol className="mb-6 list-decimal space-y-2 pl-6" {...props} />,
  blockquote: (props: React.ComponentProps<"blockquote">) => <blockquote className="my-7 border-l-4 border-blue-500 bg-blue-50 px-5 py-4 text-blue-950 [&_p]:mb-0" {...props} />,
  a: (props: React.ComponentProps<"a">) => <a className="font-bold text-blue-600 underline underline-offset-4" {...props} />,
  table: (props: React.ComponentProps<"table">) => <div className="my-7 overflow-x-auto"><table className="w-full border-collapse text-sm" {...props} /></div>,
  th: (props: React.ComponentProps<"th">) => <th className="border border-slate-200 bg-slate-50 px-4 py-3 text-left text-slate-950" {...props} />,
  td: (props: React.ComponentProps<"td">) => <td className="border border-slate-200 px-4 py-3" {...props} />,
};
