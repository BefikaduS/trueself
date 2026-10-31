"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Icon } from "../common/Icon";
import { Button } from "../common/Button";
import { LogoMark } from "../common/Logo";

interface NavLink {
  href: string;
  label: string;
  targetId?: string;
}

const LINKS: NavLink[] = [
  { href: "/#how-it-works", label: "How it works", targetId: "how-it-works" },
  { href: "/history", label: "My reports" },
  { href: "/notes", label: "Notes" },
  { href: "/appearance", label: "Appearance" },
  { href: "/privacy", label: "Privacy" },
];

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const { scrollY, scrollYProgress } = useScroll();

  // Apple liquid glass dynamic optical scale & specular refraction shift on scroll
  const navScale = useTransform(scrollY, [0, 40, 160], [1, 1.012, 1]);
  const sheenX = useTransform(scrollYProgress, [0, 1], ["-12%", "20%"]);

  // Track scroll position smoothly
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setScrolled(latest > 20);
    });
    return () => unsubscribe();
  }, [scrollY]);

  // Dismiss mobile drawer on Escape key
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  // Close mobile drawer on route change during render
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileOpen(false);
  }

  // Handle smooth scroll when navigating to anchor on same page
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, link: NavLink) => {
    if (link.targetId && pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(link.targetId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 84;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3.5 sm:pt-4"
    >
      <motion.nav
        layout
        style={{ scale: navScale }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className={`glass-nav-pill group relative flex w-full items-center justify-between overflow-hidden rounded-full transition-all duration-300 ${
          scrolled
            ? "max-w-4xl py-2 px-3.5 shadow-lg"
            : "max-w-5xl py-2.5 px-4.5"
        }`}
        aria-label="Primary"
      >
        {/* Distorted glass refraction texture layer */}
        <div className="glass-distortion-texture" aria-hidden="true" />

        {/* Apple liquid glass specular sheen highlight with scroll parallax */}
        <motion.div
          style={{ x: sheenX }}
          className="glass-specular-sheen transition-opacity duration-500 group-hover:opacity-100"
          aria-hidden="true"
        />

        {/* Brand / Logo */}
        <Link
          href="/"
          onClick={handleLogoClick}
          className="relative z-10 flex items-center gap-2.5 px-1 text-[1.05rem] font-semibold tracking-tight text-[var(--color-text)] transition-transform duration-200 active:scale-95"
        >
          <motion.span
            whileHover={{ rotate: 180, scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            className="grid place-items-center drop-shadow-xs"
          >
            <LogoMark size={28} />
          </motion.span>
          <span className="font-editorial text-lg sm:text-[1.18rem] font-semibold tracking-tight text-[var(--color-text)]">
            Trueself
          </span>
        </Link>

        {/* Desktop Links with sliding glass pill */}
        <div
          className="relative z-10 hidden items-center gap-1 md:flex"
          onMouseLeave={() => setHoveredLink(null)}
        >
          {LINKS.map((link) => {
            const isActive =
              link.href === pathname ||
              (link.href === "/history" && (pathname === "/history" || pathname === "/reports"));
            const isHovered = hoveredLink === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => handleAnchorClick(e, link)}
                onMouseEnter={() => setHoveredLink(link.href)}
                className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-[var(--color-text)]"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {/* Sliding indicator pill */}
                {isHovered && (
                  <motion.span
                    layoutId="nav-hover-pill"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-[var(--color-surface)]/80 backdrop-blur-md border border-[var(--color-border)]/40 shadow-xs"
                    aria-hidden="true"
                  />
                )}
                {!hoveredLink && isActive && (
                  <motion.span
                    layoutId="nav-active-dot"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    className="absolute inset-0 rounded-full bg-[var(--color-surface)]/60 border border-[var(--color-border)]/30"
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  {link.label}
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] animate-pulse" />
                  )}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Action button & Mobile toggle */}
        <div className="relative z-10 flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button
              size="sm"
              className="hidden !rounded-full px-5 py-2.5 shadow-xs transition-all duration-200 hover:shadow-md sm:inline-flex"
              onClick={() => router.push("/assess")}
            >
              Meet Yourself
            </Button>
          </motion.div>

          <button
            className="grid h-9 w-9 place-items-center rounded-full border border-[var(--color-nav-border)] bg-[var(--color-surface)]/50 backdrop-blur-md text-[var(--color-text)] transition-transform duration-200 active:scale-90 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
          >
            <motion.div
              animate={{ rotate: mobileOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <Icon name={mobileOpen ? "close-circle" : "hamburger-menu"} size={18} />
            </motion.div>
          </button>
        </div>

        {/* Scroll Progress Indicator Line (glowing glass track) */}
        <motion.div
          style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
          className="pointer-events-none absolute bottom-0 left-4 right-4 h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-[var(--color-accent)] to-[var(--color-accent)] opacity-75"
          aria-hidden="true"
        />
      </motion.nav>

      {/* Mobile Drawer (with distorted glass surface and spring animation) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] md:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="glass-surface absolute left-4 right-4 top-[64px] z-50 overflow-hidden rounded-[var(--radius-xl)] p-3 shadow-2xl md:hidden"
            >
              <div className="glass-distortion-texture" aria-hidden="true" />
              <div className="relative z-10 flex flex-col gap-1.5">
                {LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      handleAnchorClick(e, link);
                      setMobileOpen(false);
                    }}
                    className="rounded-[var(--radius-md)] px-4 py-3 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)] active:bg-[var(--color-surface-strong)]"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/assess"
                  onClick={() => setMobileOpen(false)}
                  className="mt-1 rounded-full bg-[var(--color-accent)] px-5 py-3 text-center text-sm font-semibold text-[var(--color-accent-text)] shadow-sm transition-transform active:scale-98"
                >
                  Meet Yourself
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
