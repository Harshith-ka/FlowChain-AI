import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FlowChain AI — Autonomous Supply Chain Recovery & Optimization SaaS",
  description: "When Supply Chains Break, Intelligence Takes Over. Autonomous disruption detection, mathematical optimization, and agentic recovery orchestration.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-text-primary antialiased selection:bg-brand-blue/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
