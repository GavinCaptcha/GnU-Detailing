import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-surface-border/80 bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            GnU
          </span>
          <span className="text-lg font-semibold tracking-tight text-white group-hover:text-brand-300">
            GnU Detailing
          </span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/#services"
            className="hidden text-sm text-slate-300 hover:text-white sm:inline"
          >
            Pricing
          </Link>
          <Link
            href="/#results"
            className="hidden text-sm text-slate-300 hover:text-white sm:inline"
          >
            Results
          </Link>
          <Link
            href="/#about"
            className="hidden text-sm text-slate-300 hover:text-white sm:inline"
          >
            About
          </Link>
          <Link
            href="/book"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-500"
          >
            Book Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
