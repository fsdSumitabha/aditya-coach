"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "@/lib/site";
import { IG_URL, YOUTUBE_URL, waLink } from "@/lib/config";
import { InstagramIcon, WhatsAppIcon, YouTubeIcon } from "@/components/icons";

/**
 * Sticky header (A5): wordmark · 8 nav links · pinned [Book] gold button.
 * ≤900px the links collapse into a hamburger; the gold button stays visible.
 * Full-screen overlay menu with staggered reveal, scroll lock, focus trap,
 * Escape-to-close.
 */
export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    hamburgerRef.current?.focus();
  }, []);

  // Scroll lock + initial focus + Escape + focus trap while the overlay is open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const focusables = overlayRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Close on route change — "adjust state during render" pattern (react.dev),
  // avoids a sync setState inside an effect.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className={`site-header${scrolled ? " scrolled" : ""}`}>
        <div className="container-site header-inner">
          <Link
            href="/"
            className="wordmark flex items-center"
            aria-label="Aditya Kumar Upadhyay — home"
          >
            {/* AKU + name, tagline dropped — built by scripts/build-logo-assets.mjs.
                56px is the most a 68px bar takes with clearance either side. */}
            <Image
              src="/logo/aku-wordmark.png"
              alt=""
              width={960}
              height={321}
              priority
              sizes="168px"
              className="h-[56px] w-auto"
            />
          </Link>

          <nav className="header-nav" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-link${isActive(l.href) ? " active" : ""}`}
                aria-current={isActive(l.href) ? "page" : undefined}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/book" className="btn-gold btn-compact">
              Book
            </Link>
            <button
              ref={hamburgerRef}
              type="button"
              className="hamburger"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span className="bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen overlay menu */}
      <div
        id="mobile-menu"
        ref={overlayRef}
        className={`mobile-overlay${open ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
      >
        <div className="overlay-top">
          <Link
            href="/"
            className="wordmark flex items-center"
            aria-label="Aditya Kumar Upadhyay — home"
            onClick={close}
          >
            <Image
              src="/logo/aku-wordmark.png"
              alt=""
              width={960}
              height={321}
              sizes="168px"
              className="h-[56px] w-auto"
            />
          </Link>
          <button
            ref={closeRef}
            type="button"
            className="hamburger"
            aria-expanded={open}
            aria-label="Close menu"
            onClick={close}
          >
            <span className="bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>

        <nav aria-label="Mobile" className="flex flex-col pt-4">
          {NAV_LINKS.map((l, i) => (
            <div
              key={l.href}
              className="overlay-item"
              style={{ "--i-delay": `${i * 60}ms` } as React.CSSProperties}
            >
              <Link
                href={l.href}
                className={`overlay-link${isActive(l.href) ? " active" : ""}`}
                aria-current={isActive(l.href) ? "page" : undefined}
                onClick={close}
              >
                {l.label}
              </Link>
            </div>
          ))}

          <div
            className="overlay-item overlay-divider"
            style={{ "--i-delay": `${NAV_LINKS.length * 60}ms` } as React.CSSProperties}
            aria-hidden="true"
          />

          <div
            className="overlay-item pop flex flex-col gap-3"
            style={{
              "--i-delay": `${(NAV_LINKS.length + 2) * 60}ms`,
            } as React.CSSProperties}
          >
            <Link href="/book" className="btn-gold w-full" onClick={close}>
              Book
            </Link>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa w-full"
              onClick={close}
            >
              <WhatsAppIcon width={20} height={20} />
              Chat with Aditya
            </a>
          </div>

          <div
            className="overlay-item flex items-center gap-5 pt-8"
            style={{
              "--i-delay": `${(NAV_LINKS.length + 3) * 60}ms`,
            } as React.CSSProperties}
          >
            <a
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-12 w-12 items-center justify-center -m-3 text-secondary hover:text-primary transition-colors"
            >
              <InstagramIcon width={22} height={22} />
            </a>
            <a
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="inline-flex h-12 w-12 items-center justify-center -m-3 text-secondary hover:text-primary transition-colors"
            >
              <YouTubeIcon width={24} height={24} />
            </a>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="inline-flex h-12 w-12 items-center justify-center -m-3 text-secondary hover:text-primary transition-colors"
            >
              <WhatsAppIcon width={22} height={22} />
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
