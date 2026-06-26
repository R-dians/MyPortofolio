import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import CursorGlow from "@/components/CursorGlow";
import { Locale } from "@/lib/dictionary";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://.vercel.app"),
  title: {
    default: "Ardian Subakti | Fullstack Developer",
    template: "%s | Ardian Subakti",
  },
  description:
    "Website portofolio personal Fullstack Developer yang colorful dan interaktif.",
  openGraph: {
    title: "Ardian Subakti | Fullstack Developer",
    description: "Portofolio interaktif dan modern dari seorang Fullstack Developer.",
    url: "/",
    siteName: "Ardian Subakti",
    images: [
      {
        url: "/images/hero.webp",
        width: 1200,
        height: 630,
        alt: "Ardian Subakti Portfolio Thumbnail",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ardian Subakti | Fullstack Developer",
    description: "Portofolio interaktif dan modern dari seorang Fullstack Developer.",
    images: ["/images/hero.webp"],
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  // 1. PERUBAHAN DISINI: 'Locale' diganti jadi 'string' agar Next.js tidak marah
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const savedTheme = localStorage.getItem('theme');
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${plusJakartaSans.className} bg-brand-bg text-brand-text antialiased selection:bg-brand-pink selection:text-white `}
      >
        <Preloader />
        <CursorGlow />

        {/* 2. PERUBAHAN DISINI: Tambahkan 'as Locale' agar komponen Navbar tetap aman */}
        <Navbar locale={locale as Locale} />

        <main className="pt-14 min-h-screen px-6 md:px-12 max-w-6xl mx-auto w-full overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
