export function Footer() {
  return (
    <footer className="border-t border-surface-border bg-surface-raised/50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-white">GnU Detailing</p>
            <p className="mt-1 text-sm text-slate-400">
              Professional interior cleaning in Ithaca — built by brothers, for
              your cabin.
            </p>
          </div>
          <div className="text-sm text-slate-400">
            <p>Mon–Fri: after 6 PM</p>
            <p>Sat–Sun: 8 AM – 8 PM</p>
            <p className="mt-2">
              <a
                href="mailto:bookings@gnudetailing.com"
                className="text-brand-400 hover:text-brand-300"
              >
                bookings@gnudetailing.com
              </a>
            </p>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} GnU Detailing. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
