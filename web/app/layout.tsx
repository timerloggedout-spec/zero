import type { Metadata } from "next";
import { JetBrains_Mono, Noto_Sans_Bengali, Noto_Sans_Devanagari, Noto_Sans_Tamil, Outfit } from "next/font/google";
import { Window } from "./chrome";
import "./globals.css";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });
const deva = Noto_Sans_Devanagari({ variable: "--font-deva", subsets: ["devanagari"], preload: false });
const taml = Noto_Sans_Tamil({ variable: "--font-taml", subsets: ["tamil"], preload: false });
const beng = Noto_Sans_Bengali({ variable: "--font-beng", subsets: ["bengali"], preload: false });

export const metadata: Metadata = {
  title: { default: "Zero Browser", template: "%s | Zero Browser" },
  description: "An open-source web browser with its own engine, written from scratch in Rust. Private by default, with vertical tabs. Made in India.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={[outfit, mono, deva, taml, beng].map((f) => f.variable).join(" ")}>
      <body>
        <Window>{children}</Window>
      </body>
    </html>
  );
}
