export const REPO = "https://github.com/vedantnimbarte/zero";

/** Markdown files from the repository root that the site renders under /docs. */
export const DOCS = [
  { slug: "prd", file: "docs/00-PRD.md", group: "spec", title: "Product requirements", about: "Vision, users, goals, features and how success is measured." },
  { slug: "architecture", file: "docs/01-ARCHITECTURE.md", group: "spec", title: "Architecture", about: "The engine specification: crates, rendering pipeline and process model." },
  { slug: "design", file: "docs/02-UI-UX-SPEC.md", group: "spec", title: "Design spec", about: "The design system, vertical tabs, split view, screens and motion." },
  { slug: "roadmap", file: "docs/03-ROADMAP.md", group: "spec", title: "Roadmap and risks", about: "Phased milestones, a realistic timeline and the risk register." },
  { slug: "security-model", file: "docs/04-SECURITY-PRIVACY.md", group: "spec", title: "Security model", about: "Threat model, sandboxing, data handling and privacy invariants." },
  { slug: "contributing", file: "CONTRIBUTING.md", group: "project", title: "Contributing", about: "How to build, test and send a change." },
  { slug: "security", file: "SECURITY.md", group: "project", title: "Reporting a vulnerability", about: "How to report a security issue privately." },
  { slug: "code-of-conduct", file: "CODE_OF_CONDUCT.md", group: "project", title: "Code of conduct", about: "The Contributor Covenant, which everyone taking part agrees to." },
];
