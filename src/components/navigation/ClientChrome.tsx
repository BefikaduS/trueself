"use client";

import { usePathname } from "next/navigation";
import { NavBar } from "./NavBar";

// The six-question assessment hides the global nav to keep the experience
// distraction-free (rule: don't let navigation compete with the questions).
// Every other screen keeps the compact glass navigation for orientation.
export function ClientChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = pathname?.startsWith("/assess");

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-[var(--radius-md)] focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--color-accent-text)] focus:shadow-lg focus:outline-none"
      >
        Skip to content
      </a>
      {!hideNav && <NavBar />}
      <div id="main-content" tabIndex={-1} className={`outline-none ${hideNav ? "" : "pt-[88px]"}`}>
        {children}
      </div>
    </>
  );
}
