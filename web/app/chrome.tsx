"use client";

import { MotionConfig, motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";

import { DOCS, REPO } from "./site";

const TABS = [
  { id: "newtab", title: "Zero", icon: <Ring size={16} /> },
  { id: "engine", title: "Engine", icon: <Icon><rect x="2.75" y="2.75" width="10.5" height="10.5" rx="2" /><rect x="6" y="6" width="4" height="4" rx=".5" /></Icon> },
  { id: "privacy", title: "Privacy", icon: <Icon><path d="M8 1.8 13 3.6v4.1c0 3-2.1 5.4-5 6.5-2.9-1.1-5-3.5-5-6.5V3.6z" /></Icon> },
  { id: "tabs", title: "Tabs and spaces", icon: <Icon><rect x="2" y="3" width="12" height="10" rx="2" /><path d="M6 3v10" /></Icon> },
  { id: "assistant", title: "Assistant", icon: <Icon><path d="M3 3.5h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H7.5L4.5 14v-2.5H3a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1z" /></Icon> },
  { id: "roadmap", title: "Roadmap", icon: <Icon><path d="M4 14.5V2.5M4 3h8l-1.8 2.8L12 8.5H4" /></Icon> },
  { id: "build", title: "Build from source", icon: <Icon><rect x="2" y="3" width="12" height="10" rx="2" /><path d="m5 6.5 2 1.5-2 1.5M8.5 10H11" /></Icon> },
];

const DOC_ICON = <Icon><path d="M4 1.75h5.5L12.25 4.5v9.75H4z" /><path d="M9.25 1.75V4.75h3M6.5 8h3.5M6.5 10.75h3.5" /></Icon>;

export function Icon({ children, size = 16 }: { children: ReactNode; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {children}
    </svg>
  );
}

/** The logo's ring: a gap near one o'clock, and the blue light where the stroke ends. */
export function Ring({ size = 20, draw = false }: { size?: number; draw?: boolean }) {
  const id = useId();
  const reduce = useReducedMotion();
  const anim = draw && !reduce;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="47" y1="10" x2="18" y2="26">
          <stop offset="0" stopColor="#B9D8FB" />
          <stop offset=".3" stopColor="#559FF3" />
          <stop offset=".85" stopColor="#559FF3" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.circle
        cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="17"
        pathLength={100} strokeDasharray="90 100" transform="rotate(-58 50 50)"
        initial={anim ? { strokeDashoffset: 90 } : false}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 1.4, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.path
        d="M46.7 12.1A38 38 0 0 0 17.1 31" fill="none" stroke={`url(#${id})`} strokeWidth="17"
        initial={anim ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.15, duration: 0.8 }}
      />
    </svg>
  );
}

export function Enter({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}

export function CopyButton({ text, quiet = false }: { text: string; quiet?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className={quiet ? "copy quiet" : "copy"}
      onClick={() => navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })}
      aria-label={copied ? "Copied" : `Copy ${text}`}
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

const SPACES = [
  { id: "home", name: "Home", color: "#559FF3" },
  { id: "work", name: "Work", color: "#E5484D" },
  { id: "study", name: "Study", color: "#30A46C" },
];

export function SpacePicker() {
  const [space, setSpace] = useState("home");
  useEffect(() => {
    document.documentElement.dataset.space = space;
  }, [space]);
  return (
    <div className="spaces" role="group" aria-label="Space">
      {SPACES.map((s) => (
        <button key={s.id} aria-pressed={space === s.id} onClick={() => setSpace(s.id)}>
          {space === s.id && <motion.span layoutId="space" className="spaces-on" transition={{ type: "spring", stiffness: 480, damping: 38 }} />}
          <i style={{ background: s.color }} />
          <span>{s.name}</span>
        </button>
      ))}
    </div>
  );
}

// The Navigation API knows whether back and forward stay on this site. TypeScript's DOM lib doesn't describe it yet.
type Navigation = EventTarget & { canGoBack: boolean; canGoForward: boolean };
const navigationApi = () => (globalThis as { navigation?: Navigation }).navigation;
function subscribeHistory(onChange: () => void) {
  navigationApi()?.addEventListener("currententrychange", onChange);
  return () => navigationApi()?.removeEventListener("currententrychange", onChange);
}
// Without the API both buttons stay enabled.
function historySnapshot() {
  const n = navigationApi();
  return n ? `${+n.canGoBack}${+n.canGoForward}` : "11";
}

function Tab({ href, current, icon, title }: { href: string; current: boolean; icon: ReactNode; title: string }) {
  return (
    <li>
      <a className="tab" href={href} aria-current={current ? "page" : undefined}>
        {current && <motion.span layoutId="active-tab" className="tab-on" transition={{ type: "spring", stiffness: 520, damping: 42 }} />}
        {icon}
        <span>{title}</span>
      </a>
    </li>
  );
}

export function Window({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [section, setSection] = useState("newtab");
  const [loads, setLoads] = useState(0);
  const [draft, setDraft] = useState<string | null>(null);
  const [docsOpen, setDocsOpen] = useState(false);
  const canGo = useSyncExternalStore(subscribeHistory, historySnapshot, () => "00");
  const page = useRef<HTMLElement>(null);
  const railTabs = useRef<HTMLDivElement>(null);
  const spyPausedUntil = useRef(0);

  const home = pathname === "/";
  const onDocs = pathname.startsWith("/docs");
  const showDocs = onDocs || docsOpen;
  const address = home ? section : pathname.slice(1);

  function go(id: string, push = true) {
    const el = document.getElementById(id);
    if (!el) return;
    // ponytail: the spy is paused for a fixed 900ms while smooth scroll passes other sections; use scrollend if that proves short.
    spyPausedUntil.current = Date.now() + 900;
    setSection(id);
    setLoads((n) => n + 1);
    el.scrollIntoView({ block: "start" });
    if (push) history.pushState(null, "", `#${id}`);
  }

  /** Opens a same-site address. Returns false when the browser's own navigation should run instead. */
  function open(href: string) {
    const url = new URL(href, location.href);
    if (url.origin !== location.origin) return false;
    if (url.pathname !== location.pathname) {
      if (url.pathname === "/") setSection(TABS.find((t) => t.id === url.hash.slice(1))?.id ?? "newtab");
      setLoads((n) => n + 1);
      router.push(url.pathname + url.hash, { scroll: false });
      return true;
    }
    const id = url.hash.slice(1);
    if (home && TABS.some((t) => t.id === id)) go(id);
    else if (!id) page.current?.scrollTo({ top: 0 });
    else return false; // an anchor inside a document
    return true;
  }

  // Each route starts at its hash target or at the top; the home page also tracks which section is in view.
  useEffect(() => {
    const root = page.current!;
    const target = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
    else root.scrollTo({ top: 0, behavior: "instant" });
    if (pathname !== "/") return;

    const io = new IntersectionObserver(
      (entries) => {
        if (Date.now() < spyPausedUntil.current) return;
        for (const e of entries) if (e.isIntersecting) setSection(e.target.id);
      },
      { root, rootMargin: "-40% 0px -59% 0px" },
    );
    TABS.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  // Back and forward within one page: the router doesn't scroll a nested container.
  useEffect(() => {
    const onPop = () => {
      const id = decodeURIComponent(location.hash.slice(1)) || (location.pathname === "/" ? "newtab" : "");
      const el = id ? document.getElementById(id) : null;
      if (!el) return;
      if (TABS.some((t) => t.id === id)) {
        spyPausedUntil.current = Date.now() + 900;
        setSection(id);
        setLoads((n) => n + 1);
      }
      el.scrollIntoView({ block: "start" });
    };
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, []);

  // Keep the current tab visible when the rail overflows: sideways as a strip, downwards as a rail.
  useEffect(() => {
    const r = railTabs.current;
    const tab = r?.querySelector<HTMLElement>(".tab[aria-current]");
    if (!r || !tab) return;
    if (matchMedia("(max-width: 760px)").matches) r.scrollTo({ left: tab.offsetLeft - 16, behavior: "smooth" });
    else if (tab.offsetTop < r.scrollTop || tab.offsetTop + tab.offsetHeight > r.scrollTop + r.clientHeight)
      r.scrollTo({ top: tab.offsetTop - 16, behavior: "smooth" });
  }, [address]);

  function submit(q: string) {
    const value = q.trim();
    const path = value.replace(/^zero:\/\//, "").replace(/\/$/, "");
    setDraft(null);
    if (TABS.some((t) => t.id === path)) open(`/#${path}`);
    else if (path === "docs" || DOCS.some((d) => `docs/${d.slug}` === path)) open(`/${path}`);
    else if (value) window.open(`https://duckduckgo.com/?q=${encodeURIComponent(value)}`, "_blank", "noopener");
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        className="window"
        onClick={(e) => {
          const a = (e.target as Element).closest("a");
          if (!a || a.target || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
          if (open(a.href)) e.preventDefault();
        }}
      >
        <nav className="rail" aria-label="Tabs">
          <div className="brand">
            <Ring size={20} />
            zero
          </div>
          <div className="pinned">
            <a href={REPO} title="Source on GitHub" aria-label="Source on GitHub">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </a>
            <a href="/docs" title="Documents" aria-label="Documents">
              {DOC_ICON}
            </a>
          </div>
          <div className="rail-tabs" ref={railTabs}>
            <ul className="tabs">
              {TABS.map((t) => (
                <Tab key={t.id} href={`/#${t.id}`} current={home && section === t.id} icon={t.icon} title={t.title} />
              ))}
            </ul>
            <div className="group">
              <div className="group-head">
                <button
                  className="group-toggle"
                  aria-expanded={showDocs}
                  aria-controls="doc-tabs"
                  aria-label={showDocs ? "Hide documents" : "Show documents"}
                  disabled={onDocs}
                  onClick={() => setDocsOpen(!docsOpen)}
                >
                  <Icon size={12}><path d="m6 3.5 4.5 4.5L6 12.5" /></Icon>
                </button>
                <a href="/docs" aria-current={pathname === "/docs" ? "page" : undefined}>Documents</a>
              </div>
              <div className="group-body" id="doc-tabs" data-open={showDocs || undefined}>
                <ul className="tabs">
                  {DOCS.map((d) => (
                    <Tab key={d.slug} href={`/docs/${d.slug}`} current={pathname === `/docs/${d.slug}`} icon={DOC_ICON} title={d.title} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="rail-foot" aria-hidden>
            <i /> <span className="space-name" />
          </div>
        </nav>

        <header className="toolbar">
          <div className="tb-left">
            <button className="tb-btn" aria-label="Back" disabled={canGo[0] === "0"} onClick={() => history.back()}>
              <Icon><path d="M10 3 5 8l5 5" /></Icon>
            </button>
            <button className="tb-btn fwd" aria-label="Forward" disabled={canGo[1] === "0"} onClick={() => history.forward()}>
              <Icon><path d="m6 3 5 5-5 5" /></Icon>
            </button>
            <button
              className="tb-btn"
              aria-label="Reload"
              onClick={() => {
                if (home) return go(section, false);
                setLoads((n) => n + 1);
                page.current?.scrollTo({ top: 0 });
              }}
            >
              <Icon><path d="M13 8a5 5 0 1 1-1.46-3.54M13.25 2.25v3h-3" /></Icon>
            </button>
          </div>
          <div className="omni">
            {draft === null ? (
              <button className="url" onClick={() => setDraft(`zero://${address}`)} aria-label={`Address: zero://${address}. Edit address`}>
                <motion.span key={address} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                  <span className="scheme">zero://</span>
                  {address}
                </motion.span>
              </button>
            ) : (
              <input
                className="url"
                autoFocus
                aria-label="Address"
                value={draft}
                spellCheck={false}
                onFocus={(e) => e.target.select()}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={() => setDraft(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submit(draft);
                  if (e.key === "Escape") setDraft(null);
                }}
              />
            )}
            <span className="shield" title="No trackers on this page">
              <Icon size={14}><path d="M8 1.8 13 3.6v4.1c0 3-2.1 5.4-5 6.5-2.9-1.1-5-3.5-5-6.5V3.6z" /></Icon>
              <span>0</span>
              <span className="sr">trackers blocked</span>
            </span>
          </div>
          {loads > 0 && (
            <motion.div
              key={loads}
              className="load"
              initial={{ scaleX: 0, opacity: 1 }}
              animate={{ scaleX: 1, opacity: 0 }}
              transition={{ scaleX: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }, opacity: { delay: 0.55, duration: 0.35 } }}
            />
          )}
        </header>

        <main className="page" ref={page}>
          {children}
        </main>
      </div>
    </MotionConfig>
  );
}
