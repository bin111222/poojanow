import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "PoojaNow | Divine Connections",
  description: "Experience the divine. Book verified pandits and exclusive temple poojas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={cn(
          "min-h-screen bg-stone-50 font-sans antialiased selection:bg-orange-100 selection:text-orange-900",
          inter.variable,
          playfair.variable
        )}
      >
        <Navbar />
        <main className="flex-1">
            {children}
        </main>
        <Toaster />
        <footer className="border-t border-stone-200 py-16 bg-stone-100/50 mt-auto">
            <div className="container px-4 grid md:grid-cols-4 gap-12">
                <div className="space-y-4">
                    <h3 className="font-heading text-2xl font-bold text-stone-900">PoojaNow</h3>
                    <p className="text-sm text-stone-600 leading-relaxed max-w-xs">
                        Bridging the gap between devotion and technology. Your trusted partner for spiritual services in the digital age.
                    </p>
                </div>
                <div>
                    <h4 className="font-semibold mb-6 text-stone-900">Discover</h4>
                    <ul className="space-y-3 text-sm text-stone-600">
                        <li><a href="/temples" className="hover:text-orange-600 transition-colors">Temples</a></li>
                        <li><a href="/pandits" className="hover:text-orange-600 transition-colors">Pandits</a></li>
                        <li><a href="/live" className="hover:text-orange-600 transition-colors">Live Darshan</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-6 text-stone-900">Company</h4>
                    <ul className="space-y-3 text-sm text-stone-600">
                        <li><a href="#" className="hover:text-orange-600 transition-colors">About</a></li>
                        <li><a href="#" className="hover:text-orange-600 transition-colors">Careers</a></li>
                        <li><a href="#" className="hover:text-orange-600 transition-colors">Contact</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold mb-6 text-stone-900">Legal</h4>
                    <ul className="space-y-3 text-sm text-stone-600">
                        <li><a href="#" className="hover:text-orange-600 transition-colors">Privacy</a></li>
                        <li><a href="#" className="hover:text-orange-600 transition-colors">Terms</a></li>
                    </ul>
                </div>
            </div>
            <div className="container px-4 mt-16 pt-8 border-t border-stone-200 text-center text-sm text-stone-500">
                © {new Date().getFullYear()} PoojaNow. All rights reserved.
            </div>
        </footer>
      </body>
    </html>
  );
}
