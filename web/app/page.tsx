import { CopyButton, Enter, Icon, Ring, SpacePicker } from "./chrome";
import { REPO } from "./site";

const CLONE = `git clone ${REPO}`;

function Status({ state, children }: { state: "done" | "part" | "later"; children: string }) {
  return (
    <span className={`status ${state}`}>
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
        <circle cx="7" cy="7" r="5" fill="none" strokeWidth="2.5" pathLength={100} transform="rotate(-90 7 7)" />
      </svg>
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <>
      <section id="newtab" className="sec hero">
        <Ring size={88} draw />
        <Enter delay={0.5}>
          <h1>A browser built from zero.</h1>
          <p className="lede">
            Zero&rsquo;s rendering engine, JavaScript engine and networking stack are written from scratch in Rust.
            Tabs run down the side, privacy is on before you open settings, and it&rsquo;s made in India.
          </p>
        </Enter>
        <Enter delay={0.75} className="hero-cta">
          <div className="cmd">
            <Icon size={18}><rect x="2" y="3" width="12" height="10" rx="2" /><path d="m5 6.5 2 1.5-2 1.5M8.5 10H11" /></Icon>
            <code>{CLONE}</code>
            <CopyButton text={CLONE} />
          </div>
          <p className="hint">
            Then run <code>cargo run</code> inside the folder. Zero is in early alpha, so expect rough edges.{" "}
            <a href="#build">See every step</a>
          </p>
        </Enter>
      </section>

      <section id="engine" className="sec">
        <div className="col">
          <h2>The engine is ours, top to bottom.</h2>
          <p className="lede">
            Arc, Dia and Comet are built on Chromium. Zero parses, styles, lays out, paints and runs scripts with its
            own code. Hacker News, DuckDuckGo results and Wikipedia articles already render close to correctly,
            stylesheets, tables and forms included.
          </p>

          <dl className="specs">
            <dt>HTML</dt>
            <dd>A tolerant parser with character references, raw-text and void elements.</dd>
            <dt>CSS</dt>
            <dd>The cascade with specificity, media queries, custom properties, transforms and transitions.</dd>
            <dt>Layout</dt>
            <dd>Block, inline, flex, grid, tables, floats and positioning.</dd>
            <dt>JavaScript</dt>
            <dd>Its own lexer, parser and interpreter: classes, closures, promises, await, fetch and DOM events.</dd>
            <dt>SVG</dt>
            <dd>Its own rasterizer for shapes, paths, fills and strokes.</dd>
            <dt>Text</dt>
            <dd>Shaped with HarfBuzz, with a fallback chain for Latin, Indic and CJK scripts.</dd>
          </dl>

          <figure className="specimen">
            <p lang="hi" className="deva">नमस्ते, दुनिया</p>
            <p lang="ta" className="taml">வணக்கம், உலகம்</p>
            <p lang="bn" className="beng">ওহে বিশ্ব</p>
            <figcaption>Devanagari, Tamil and Bengali, shaped the way they are written.</figcaption>
          </figure>

          <p className="aside">
            When a page doesn&rsquo;t render well yet, <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>O</kbd> opens it in the
            browser you already have.
          </p>
        </div>
      </section>

      <section id="privacy" className="sec dark">
        <div className="col wide">
          <h2>Privacy is the default, not a setting.</h2>
          <p className="lede">
            Zero sends no telemetry unless you opt in. Your profile stays on your machine, and it&rsquo;s encrypted
            there.
          </p>
          <div className="grid">
            <div>
              <h3>Trackers and ads filtered</h3>
              <p>Blocked with Adblock-syntax lists. The shield in the address bar counts them, and this page has none.</p>
            </div>
            <div>
              <h3>HTTPS first</h3>
              <p>Pages load over HTTPS whenever the site offers it.</p>
            </div>
            <div>
              <h3>Storage kept per site</h3>
              <p>Cookies and localStorage are partitioned, so one site can&rsquo;t follow you onto another.</p>
            </div>
            <div>
              <h3>Encrypted at rest</h3>
              <p>DPAPI on Windows. AES-256-GCM under a Keychain or Secret Service key on macOS and Linux.</p>
            </div>
            <div>
              <h3>Each tab in its own process</h3>
              <p>Page content runs in a separate renderer, away from your history, cookies and profile key.</p>
            </div>
            <div>
              <h3>Sync without a server</h3>
              <p>Export a space as a sealed file with a code only you hold. Keep it in any folder you already sync.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="tabs" className="sec">
        <div className="col">
          <h2>Tabs down the side, where their names fit.</h2>
          <p className="lede">
            Screens are wider than they are tall. Zero stacks tabs in a rail you can collapse to icons, or switch to a
            strip along the top in settings.
          </p>
          <div className="grid three">
            <div>
              <h3>Split view</h3>
              <p>Two pages side by side, each one its own tab.</p>
            </div>
            <div>
              <h3>Spaces</h3>
              <p>Separate profiles in one window, each with its own tabs, history, cookies and encryption key.</p>
            </div>
            <div>
              <h3>English or हिन्दी</h3>
              <p>The interface speaks both, and Indic scripts can be typed with an input method.</p>
            </div>
          </div>
          <div className="try">
            <SpacePicker />
            <p>Switch spaces and watch the active tab. Each space has its own accent, so you always know which profile you&rsquo;re typing into.</p>
          </div>
        </div>
      </section>

      <section id="assistant" className="sec">
        <div className="col wide split">
          <div>
            <h2>Ask about a page without sending it anywhere.</h2>
            <p className="lede">
              Press <kbd>Ctrl</kbd> <kbd>I</kbd> to open the assistant beside the page. Summaries are made on your
              device.
            </p>
          </div>
          <figure className="panel" aria-label="Example of the assistant panel">
            <div className="panel-head">
              <span>Assistant</span>
              <span className="panel-page">zero://newtab</span>
            </div>
            <div className="panel-body">
              <p className="ask">Summarize this page</p>
              <p>Zero is an early-alpha web browser with its own engine, written in Rust.</p>
              <ul>
                <li>Renders HTML, CSS and JavaScript with code written for Zero</li>
                <li>Filters trackers, partitions cookies and encrypts your profile</li>
                <li>Builds from source with cargo run</li>
              </ul>
            </div>
            <figcaption>Made on this device</figcaption>
          </figure>
        </div>
      </section>

      <section id="roadmap" className="sec">
        <div className="col">
          <h2>Where Zero is today.</h2>
          <p className="lede">
            A browser engine is decades of work. Zero ships in phases, and each one is usable for a bigger slice of the
            web.
          </p>
          <ol className="phases">
            <li>
              <span className="num">0</span>
              <div>
                <h3>Foundation</h3>
                <p>The workspace, a window and a first render.</p>
              </div>
              <Status state="done">Done</Status>
            </li>
            <li>
              <span className="num">1</span>
              <div>
                <h3>A usable minimal browser</h3>
                <p>Tabs, history, bookmarks, settings, tracker blocking and a renderer process per tab.</p>
              </div>
              <Status state="done">Done</Status>
            </li>
            <li>
              <span className="num">2</span>
              <div>
                <h3>Real-world capable</h3>
                <p>Flexbox, grid, floats, transforms, WebP, SVG and promises have landed. Broader paint fidelity is next.</p>
              </div>
              <Status state="part">In progress</Status>
            </li>
            <li>
              <span className="num">3</span>
              <div>
                <h3>Compatibility and hardening</h3>
                <p>Site isolation, a renderer per site, audio and video. This is 1.0.</p>
              </div>
              <Status state="later">Later</Status>
            </li>
            <li>
              <span className="num">4</span>
              <div>
                <h3>Scale</h3>
                <p>A JIT, HTTP/3, Android, extensions and developer tools.</p>
              </div>
              <Status state="later">Later</Status>
            </li>
          </ol>
          <p className="aside">
            The full plan, with its risks, is in <a href="/docs/roadmap">the roadmap document</a>.
          </p>
        </div>
      </section>

      <section id="build" className="sec">
        <div className="col">
          <h2>Build Zero from source.</h2>
          <p className="lede">There are no installers yet. Building takes three steps on Windows, macOS or Linux.</p>
          <ol className="steps">
            <li>
              <h3>Install Rust</h3>
              <p>
                Any recent stable toolchain from <a href="https://rustup.rs">rustup.rs</a>.
              </p>
            </li>
            <li>
              <h3>Clone the repository</h3>
              <div className="code">
                <code>{`${CLONE} && cd zero`}</code>
                <CopyButton text={`${CLONE} && cd zero`} quiet />
              </div>
            </li>
            <li>
              <h3>Run it</h3>
              <p>The first build compiles the whole engine, so give it a few minutes.</p>
              <div className="code">
                <code>cargo run</code>
                <CopyButton text="cargo run" quiet />
              </div>
              <div className="code">
                <code>cargo run -- https://news.ycombinator.com</code>
                <CopyButton text="cargo run -- https://news.ycombinator.com" quiet />
              </div>
            </li>
          </ol>

          <h3 className="keys-title">Keys to know</h3>
          <dl className="keys">
            <div><dt>New tab</dt><dd><kbd>Ctrl</kbd> <kbd>T</kbd></dd></div>
            <div><dt>Search tabs</dt><dd><kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>A</kbd></dd></div>
            <div><dt>Collapse the tab rail</dt><dd><kbd>Ctrl</kbd> <kbd>\</kbd></dd></div>
            <div><dt>Open the assistant</dt><dd><kbd>Ctrl</kbd> <kbd>I</kbd></dd></div>
            <div><dt>Find on page</dt><dd><kbd>Ctrl</kbd> <kbd>F</kbd></dd></div>
            <div><dt>Open in your other browser</dt><dd><kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>O</kbd></dd></div>
          </dl>
        </div>
      </section>

      <footer className="foot">
        <span className="foot-brand">
          <Ring size={18} /> zero
        </span>
        <span>Open source under Apache 2.0. Made in India.</span>
        <nav aria-label="Project">
          <a href={REPO}>GitHub</a>
          <a href="/docs">Documents</a>
          <a href="/docs/contributing">Contributing</a>
          <a href="/docs/security">Security</a>
        </nav>
      </footer>
    </>
  );
}
