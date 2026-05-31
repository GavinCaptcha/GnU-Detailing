const GALLERY_ITEMS = [
  {
    id: "seats",
    label: "Front seats",
    before: "Stained fabric & crumbs",
    after: "Vacuumed & refreshed",
  },
  {
    id: "dash",
    label: "Dashboard",
    before: "Dusty console & smudges",
    after: "Wiped & detailed",
  },
  {
    id: "carpet",
    label: "Floor mats",
    before: "Ground-in dirt & debris",
    after: "Deep vacuumed",
  },
] as const;

function MockPhoto({
  variant,
  caption,
}: {
  variant: "before" | "after";
  caption: string;
}) {
  const isBefore = variant === "before";
  return (
    <div className="relative overflow-hidden rounded-xl border border-surface-border aspect-[4/3]">
      <div
        className={`absolute inset-0 ${
          isBefore
            ? "bg-gradient-to-br from-stone-700 via-stone-800 to-stone-900"
            : "bg-gradient-to-br from-slate-600 via-slate-700 to-brand-900/80"
        }`}
      />
      {/* Simulated car interior shapes */}
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <div
          className={`mb-3 h-16 rounded-lg ${
            isBefore ? "bg-stone-600/60" : "bg-slate-500/40"
          }`}
        />
        <div className="flex gap-2">
          <div
            className={`h-8 flex-1 rounded ${
              isBefore ? "bg-stone-600/50" : "bg-brand-600/30"
            }`}
          />
          <div
            className={`h-8 w-1/3 rounded ${
              isBefore ? "bg-stone-600/40" : "bg-brand-500/25"
            }`}
          />
        </div>
      </div>
      {isBefore && (
        <div className="pointer-events-none absolute inset-0 opacity-30">
          <div className="absolute left-[20%] top-[30%] h-8 w-12 rotate-12 rounded-full bg-stone-500/50" />
          <div className="absolute right-[25%] top-[45%] h-6 w-10 -rotate-6 rounded-full bg-stone-500/40" />
        </div>
      )}
      <span
        className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${
          isBefore
            ? "bg-stone-900/80 text-stone-300"
            : "bg-brand-600/90 text-white"
        }`}
      >
        {isBefore ? "Before" : "After"}
      </span>
      <p className="absolute bottom-3 left-3 right-3 text-xs text-white/80">
        {caption}
      </p>
    </div>
  );
}

export function BeforeAfterGallery() {
  return (
    <section id="results" className="border-y border-surface-border bg-surface-raised/20">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-brand-400">
            Our work
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">Before & after</h2>
          <p className="mx-auto mt-3 max-w-lg text-slate-400">
            Real transformations from our interior cleans — placeholder photos
            for now; we&apos;ll add yours soon.
          </p>
        </div>

        <div className="mt-12 space-y-16">
          {GALLERY_ITEMS.map((item) => (
            <article key={item.id}>
              <h3 className="mb-4 text-center text-lg font-medium text-slate-300">
                {item.label}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <MockPhoto variant="before" caption={item.before} />
                <MockPhoto variant="after" caption={item.after} />
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-slate-500">
          Sample placeholders — replace with your own before & after photos when
          ready.
        </p>
      </div>
    </section>
  );
}
