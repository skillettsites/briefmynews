import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white text-xs font-bold">
                B
              </div>
              <span className="font-semibold text-foreground">BriefMyNews</span>
            </div>
            <p className="text-sm text-muted">
              Personalised news digests, delivered on your schedule.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-foreground">
              Account
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/login"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Log In
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-sm text-muted">
          &copy; {new Date().getFullYear()} BriefMyNews. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
