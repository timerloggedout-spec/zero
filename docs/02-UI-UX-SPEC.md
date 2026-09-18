# Zero Browser — UI/UX Specification

**Version:** 0.1 (Draft)
**Last updated:** 2026-07-21
**Design language:** Minimal, spacious, content-first. Inspired by Arc, Dia, and
Perplexity Comet. Reference images 1 (split view + vertical tabs) and 2 (dark new-tab page).

---

## 1. Design principles

1. **Content over chrome.** The web page is the hero. Browser UI recedes; the tab rail
   collapses; the toolbar can auto-hide.
2. **Spacious, not sparse.** Generous padding and breathing room, but every element earns
   its place. No dense toolbars.
3. **One primary input.** The command bar is the center of gravity — navigation, search,
   AI, and actions converge there.
4. **Calm motion.** Animations are quick, soft, purposeful (spring-based), never flashy.
5. **Adaptive theming.** Light + dark, and per-space accent colors (Arc-style).
6. **Accessible by default.** WCAG AA contrast, full keyboard nav, screen-reader labels,
   respects `reduced-motion` and OS scaling.

---

## 2. Layout anatomy

```
┌────────────────────────────────────────────────────────────────┐
│ [traffic lights]                                     [window]   │  ← minimal title bar
├──────────────┬─────────────────────────────────────────────────┤
│              │  ◀ ▶ ⟳    [ command / address bar ]   🛡 ⧉ 👤    │  ← toolbar (auto-hideable)
│  SIDEBAR     ├─────────────────────────────────────────────────┤
│  (vertical   │                                                 │
│   tabs)      │                                                 │
│              │              WEB CONTENT / SPLIT PANES           │
│  + New Tab   │                                                 │
│              │                                                 │
│  ── spaces ──│                                                 │
│  ● ● ● +     │                                                 │
└──────────────┴─────────────────────────────────────────────────┘
```

- **Sidebar (left):** vertical tab rail + spaces. Collapsible to an icon strip or fully hidden.
- **Toolbar (top):** back/forward/reload, command bar (centered, wide), privacy shield,
  split/layout control, profile/account. Auto-hides in focus mode.
- **Content area:** single page or split panes (see §5).

---

## 3. Design tokens

> These become code-level constants shared between the UI-UX spec and `zero-ui`.

### 3.1 Color — Light (default, and the website's own palette)

Taken from the logo: the slate ink of the ring, the white it sits on, and the
blue light where its stroke ends. `web/app/globals.css` uses the same values, so
the site's browser mock-up and the browser are one design.

| Token | Value | Use |
|-------|-------|-----|
| `canvas` | `#FFFFFF` | behind pages |
| `chrome` | `#F3F5F7` | the window's own surface: rail and toolbar |
| `elevated` | `#FFFFFF` | menus, tooltips |
| `surface` | `#FFFFFF` | buttons, cards, the address pill |
| `hover` | `#E7EAEE` | hover states |
| `line` | `#E3E7EB` | dividers, card borders |
| `text` | `#1A222B` | primary text |
| `muted` | `#5B6570` | secondary/labels |
| `faint` | `#8A939C` | hints, placeholders |
| `accent` | per-space (default `#559FF3`, the ring's light) | active tab, CTAs |
| `ok` | `#2A8F5E` | a secure connection |
| `saved` | `#D08700` | a bookmarked page |

### 3.2 Color — Dark

| Token | Value |
|-------|-------|
| `canvas` | `#0E0F12` |
| `chrome` | `#121317` |
| `elevated` | `#16181D` |
| `surface` | `#1E2027` |
| `hover` | `#282B34` |
| `line` | `#262931` |
| `text` | `#E8EAED` |
| `muted` | `#8B919B` |
| `faint` | `#5F646E` |

Both sets live in `app::theme::Palette`, and the **Theme** preference picks one —
Light, Dark, or System, which reads the desktop's own setting.

### 3.3 Typography
- **UI font:** Inter (or system UI stack fallback); Indic scripts via Noto Sans / Noto Sans Devanagari etc.
- Scale: `12 / 13 / 14 / 16 / 20 / 24 / 32` px. Base UI size **13px**, page-title **14px** medium.
- Line-height: 1.4 body, 1.2 headings. Weights: 400 / 500 / 600.

### 3.4 Spacing & radius
- Spacing scale (px): `2 4 6 8 12 16 20 24 32 48`.
- Radius: `6` (controls), `10` (cards/tabs), `14` (panels/popovers), `20` (search bar pill).
- Sidebar width: `240px` default, `56px` collapsed (icons), `0` hidden.

### 3.5 Elevation & motion
- Shadows: soft, low-opacity (`0 2px 8px rgba(0,0,0,.24)` dark; lighter in light theme).
- Motion: spring `~300ms`, ease-out for enter, ease-in for exit. Tab reorder uses FLIP.
- Respect `prefers-reduced-motion` → cross-fade only.

---

## 4. Vertical tabs (flagship feature)

Per reference image 1's left rail.

### 4.1 Behavior
- Tabs stack **vertically** in the sidebar; each shows favicon + title + close (on hover).
- **Active tab:** accent wash background (`--accent-soft`), accent left-edge or fill.
- **Drag to reorder**; drag onto another tab to **group**; drag to space to move.
- **Pin:** pinned tabs collapse to favicon-only at the top of the rail.
- **Groups:** collapsible, colored, labeled sections.
- **New Tab** button + keyboard `⌘/Ctrl-T`. **Close** `⌘/Ctrl-W` with undo toast.
- **Collapse control:** toggle sidebar to icon-only or hidden; content expands full-width.
- **Hover-peek:** when hidden, hovering the left edge slides the rail out temporarily.
- **Tab context menu:** Move Left/Right (in split), Add Right/Left Split, Pin, Duplicate,
  Close, Close Others, Add to Space (mirrors reference image 1 menu).

### 4.2 States
`default · hover · active · loading (spinner in favicon slot) · muted (audio icon) · pinned · grouped · unloaded/slept (dimmed)`

---

## 5. Split view

Per reference image 1 (two side-by-side site panes with their own mini-toolbars).

- 2 panes in v1 (design allows N); each pane has its own back/reload/close and URL chip.
- Add via tab context menu ("Add Right/Left Split") or drag a tab to screen edge.
- **Draggable divider** to resize; snap to 50/50, 33/66, 66/33.
- Each pane is an independent tab; closing a pane returns to single view.
- Per-pane menu: Move Left, Move Right, Add Right Split, Add Left Split (matches reference).

---

## 6. Command / address bar

The product's center of gravity — merges URL, search, and AI.

- **Idle:** pill input, centered in toolbar, placeholder "Search or type a URL" (localized).
- **On focus:** expands into a dropdown with sections:
  - **Actions** (AI intents: "Summarize this page", "Open split with…")
  - **Suggestions** (history, bookmarks, open tabs)
  - **Search** (default engine; Indian-language aware)
  - **Ask AI** (send query to AI assistant)
- Keyboard-first: arrow to navigate, `Enter` to go, `Tab` to accept, `⌘/Ctrl-L` to focus.
- **AI mode toggle:** an inline control to switch a query between "navigate/search" and
  "ask AI" (echoes Comet's search/ask duality).

---

## 7. New-tab page

Per reference image 2. Dark, spacious, centered.

- **Center:** brand mark → privacy assurances row (Confidential Search · Tracker Blocking ·
  Encryption) → large rounded **search bar** with mic + lens icons and an accent "Search"
  button.
- **Left vertical rail:** quick-launch social/app icons (user-customizable), settings gear at bottom.
- **Shortcut tiles:** grid of frequent sites (add tile "+").
- **Top Stories:** category chip row (All · Top · Health · Weather · Dining · Entertainment ·
  Travel · Sports) → card feed. India-localized, **opt-in** content.
- **Floating (bottom-right):** AI chat launcher + community/account.
- Everything on this page is arranged with heavy whitespace and rounded cards.

---

## 8. AI surfaces

- **AI sidebar (right, on demand):** "Chat with this page" — summarize, ask, extract.
  Slides in over content or as a third split; scoped to current tab/space.
- **Command-bar AI:** inline answers and actions (see §6).
- **Agentic confirmations:** when AI proposes a multi-step action, a clear inline card
  shows the plan and requires explicit "Run" — never silent action.
- **Model/privacy indicator:** small badge showing on-device vs cloud, and whether page
  content will be sent (must be explicit).

---

## 9. Spaces & profiles

Per reference image 1 (bottom-left space switcher, "Design" pill).

- **Spaces** = named, themed sets of tabs (own accent color, own tab set).
- Switch via bottom-of-sidebar switcher (dots + label), or `⌘/Ctrl-number`.
- **Profiles** = separate identity + storage jar (work/personal); a profile can hold multiple spaces.
- Visual: switching space animates accent + tab set; keeps you oriented.

---

## 10. Privacy UI

- **Shield icon** in toolbar → popover: trackers/ads blocked on this site (count),
  toggles for protections, "why am I seeing this" transparency.
- **Data passport** (Settings): plain-language view of what's stored, where, and clear/export controls.
- **Per-site permissions:** camera, mic, location, notifications — clear grant/deny, default-deny.

---

## 11. Localization & Indic UX

- UI mirrors correctly for RTL where needed (Urdu); complex-script shaping for Devanagari,
  Tamil, Telugu, Bengali, etc. — text must shape correctly *in-engine*, not just in the OS.
- Language picker in first-run and settings; per-site translate (later).
- Indic **IME** support in all inputs incl. the command bar.
- Numerals, dates, currency (₹) localized.

---

## 12. Key screens to design (deliverable checklist for the prototype phase)

Built items are live in the Rust shell (`crates/zero-shell/src/app.rs`) and can be
screenshotted headlessly with `--shot`'s poses — see the README.

- [ ] First-run / onboarding (language, import, privacy explainer)
- [x] Main window — single tab, light and dark
- [x] Main window — vertical tabs expanded / icons / hidden, and a horizontal strip
- [ ] Split view (2 panes) + context menu
- [x] New-tab page — the mark, one field, and the sites you actually use
- [x] Find-in-page bar; command-bar AI states still to come
- [x] AI sidebar (chat with page); agentic confirmation card to come
- [ ] Spaces switcher + space theming
- [x] Tracker-blocked count in the toolbar; shield popover + Data passport to come
- [x] Settings (privacy-first IA) — `zero://settings`
- [x] Downloads / History / Bookmarks — `zero://downloads`, `zero://history`, `zero://bookmarks`
- [x] Empty states for the built-in pages; loading/offline states to come

### Notes from the first build

The chrome is rendered by Zero's own engine as small HTML documents, which
constrains the visual language in ways worth recording:

- **No `font-family`.** The engine draws every string from one fallback chain, so
  the chrome cannot ask for a different face from the page — which is why the UI
  is set in the system's own UI font rather than the website's Outfit. Bundling it
  would change what *pages* look like too.
- **No `font-weight` worth leaning on.** A heavier weight is synthesized rather
  than picked from a face, so hierarchy comes from size, colour and spacing.
  Brightness is the weight axis: `text` reads as bold, `muted` as regular,
  `faint` as light.
- **Icons are inline `<svg>`,** drawn by the engine's own rasterizer — the same
  code a page's icons go through. Each is told its colour, because `currentColor`
  has no cascade to read inside an SVG.
- **Round corners on a floating surface are the compositor's job.** The engine
  paints onto an opaque canvas, so a menu, a tooltip and the page card get their
  corners cut in `blit_rounded`/`frame_pane` rather than by `border-radius`.
- **CSS transitions exist now** but the chrome does not use them: it is re-rendered
  per frame from scratch, so there is no previous value to interpolate from. The tab
  rail's width eases toward its target with exponential smoothing (~260ms), and
  the window requests the next frame only while something is moving. The rail's
  markup is sized from its *current* width, not its setting, so it squeezes its
  labels on the way and swaps to initials as it passes 150px. The page is not
  re-laid-out mid-slide — the last layout is slid and reflows on landing.
  §3.5's other motion (tab reorder, FLIP, spring curves) is still deferred.
- **No `prefers-reduced-motion`.** winit exposes no such signal, so it is an
  explicit **Animation** setting rather than an assumption.
- **Hairlines carry the structure** that bolder type would otherwise carry, which
  is why `--border-subtle` does much more work here than the spec anticipated.
- **The accent marks position, never fills.** The active tab takes an accent
  *edge* — left in the rail and in the horizontal strip, bottom on the chosen
  segment in Settings, and the space's dot in the rail's footer. Nothing in the
  product is filled with it. The mark itself is not themed at all: the ring is
  ink with its own blue light, whatever the space's colour is.
- **No `text-overflow`.** Labels are truncated in Rust to a character count that
  fits, because an over-long label wraps and is clipped instead of trailing off.

---

## 13. Accessibility requirements

- WCAG 2.1 AA contrast on all text/controls.
- Full keyboard operability; visible focus rings; logical tab order.
- Screen-reader labels/roles on every control; live regions for async updates.
- Honor OS: reduced motion, increased contrast, text scaling, dark/light.
- Minimum hit target 32×32px.

---

## 14. Prototype plan (next step after doc approval)

Build a **high-fidelity clickable HTML/CSS prototype** of the key screens (using the
frontend design skill) — light + dark, real interactions for vertical tabs, split view,
command bar, and new-tab page — to validate the design before Rust UI implementation. The
prototype's tokens map 1:1 to `zero-ui` design tokens (§3) so the visual language transfers
directly to the native shell.
