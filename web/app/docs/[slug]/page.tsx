import { readFile } from "node:fs/promises";
import path from "node:path";
import { Marked } from "marked";
import type { Metadata } from "next";
import { DOCS, REPO } from "../../site";

export const dynamicParams = false;
export const generateStaticParams = () => DOCS.map((d) => ({ slug: d.slug }));

const find = (slug: string) => DOCS.find((d) => d.slug === slug)!;

export async function generateMetadata({ params }: PageProps<"/docs/[slug]">): Promise<Metadata> {
  const doc = find((await params).slug);
  return { title: doc.title, description: doc.about };
}

// GitHub's heading anchors, so links written for GitHub still land.
const slugify = (text: string) => text.toLowerCase().trim().replace(/[^\p{L}\p{N}\s_-]/gu, "").replace(/\s/g, "-");

/** Links are written relative to the file on GitHub. Ones that reach a rendered document stay on this site. */
function resolve(href: string, file: string) {
  if (href.startsWith("#")) return href;
  const url = new URL(href, `${REPO}/blob/main/${file}`);
  const doc = DOCS.find((d) => url.href.split("#")[0] === `${REPO}/blob/main/${d.file}`);
  return doc ? `/docs/${doc.slug}${url.hash}` : url.href;
}

function render(markdown: string, file: string) {
  const outline: { id: string; html: string }[] = [];
  const seen = new Map<string, number>();
  const marked = new Marked({
    renderer: {
      heading({ tokens, depth, text }) {
        const base = slugify(text);
        const n = seen.get(base) ?? 0;
        seen.set(base, n + 1);
        const id = n ? `${base}-${n}` : base;
        const html = this.parser.parseInline(tokens);
        if (depth === 2) outline.push({ id, html });
        return `<h${depth} id="${id}">${html}</h${depth}>\n`;
      },
      link({ href, tokens }) {
        return `<a href="${resolve(href, file)}">${this.parser.parseInline(tokens)}</a>`;
      },
    },
  });
  return { html: marked.parse(markdown, { async: false }), outline };
}

export default async function Doc({ params }: PageProps<"/docs/[slug]">) {
  const doc = find((await params).slug);
  // The files live in the repository root, one level above this app.
  const markdown = await readFile(path.join(process.cwd(), "..", doc.file), "utf8");
  const { html, outline } = render(markdown, doc.file);

  return (
    <div className="doc">
      <article className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      {outline.length > 2 && (
        <nav className="outline" aria-labelledby="outline-title">
          <p id="outline-title">On this page</p>
          <ul>
            {outline.map((h) => (
              <li key={h.id}>
                <a href={`#${h.id}`} dangerouslySetInnerHTML={{ __html: h.html }} />
              </li>
            ))}
          </ul>
        </nav>
      )}
      <p className="doc-source">
        This page is <code>{doc.file}</code> from the repository. <a href={`${REPO}/blob/main/${doc.file}`}>Edit it on GitHub</a>
      </p>
    </div>
  );
}
