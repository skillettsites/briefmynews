"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white text-sm font-bold">
            B
          </div>
          <span className="text-lg font-semibold text-foreground">
            BriefMyNews
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/how-it-works"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/sources"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Sources
          </Link>
          <Link
            href="/blog"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="/login"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-5 w-5 text-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href="/how-it-works"
              className="text-sm text-muted hover:text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-muted hover:text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/sources"
              className="text-sm text-muted hover:text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              Sources
            </Link>
            <Link
              href="/blog"
              className="text-sm text-muted hover:text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-sm text-muted hover:text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/login"
              className="text-sm text-muted hover:text-foreground"
              onClick={() => setMenuOpen(false)}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="mt-2 rounded-full bg-primary px-4 py-2 text-center text-sm font-medium text-white"
              onClick={() => setMenuOpen(false)}
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
