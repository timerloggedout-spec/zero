import type { Metadata } from "next";
import { DOCS } from "../site";

export const metadata: Metadata = {
  title: "Documents",
  description: "Zero's product, architecture, design, roadmap and security documents.",
};

const GROUPS = [
  { id: "spec", title: "Specifications", about: "How Zero is meant to work, and the order it gets built in." },
  { id: "project", title: "Taking part", about: "How to contribute, and how to report a problem." },
];

export default function Docs() {
  return (
    <section className="sec docs">
      <div className="col">
        <h1>Documents</h1>
        <p className="lede">Zero is planned in the open. These are the same files that live in the repository, kept up to date as the work lands.</p>
        {GROUPS.map((g) => (
          <div key={g.id} className="doc-group">
            <h2>{g.title}</h2>
            <p>{g.about}</p>
            <ul className="doc-list">
              {DOCS.filter((d) => d.group === g.id).map((d) => (
                <li key={d.slug}>
                  <a href={`/docs/${d.slug}`}>
                    <h3>{d.title}</h3>
                    <p>{d.about}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
