import Image from "next/image";

export function FoundersPhoto({ className = "" }: { className?: string }) {
  return (
    <figure className={`relative ${className}`}>
      <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-brand-500/20 via-transparent to-brand-700/10 blur-sm" />
      <div className="relative overflow-hidden rounded-2xl border border-surface-border bg-surface-raised shadow-xl shadow-black/30">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-surface/80 via-transparent to-transparent" />
        <Image
          src="/founders.png"
          alt="Uncas and Gavin, founders of GnU Detailing, shaking hands in their company polo shirts"
          width={680}
          height={1020}
          className="aspect-[2/3] w-full object-cover object-[center_20%]"
          priority
        />
        <figcaption className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-5 pt-12">
          <p className="text-sm font-semibold text-white">Uncas &amp; Gavin</p>
          <p className="text-xs text-slate-300">Brothers · Ithaca, NY</p>
        </figcaption>
      </div>
    </figure>
  );
}
