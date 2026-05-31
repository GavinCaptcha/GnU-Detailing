import Image from "next/image";

function PhotoFrame({
  src,
  alt,
  caption,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <figure className={`relative overflow-hidden rounded-2xl border border-surface-border bg-surface-raised shadow-xl shadow-black/30 ${className}`}>
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-surface/90 via-surface/10 to-transparent" />
      <Image
        src={src}
        alt={alt}
        width={680}
        height={1020}
        priority={priority}
        sizes="(max-width: 1024px) 90vw, 340px"
        className="aspect-[3/4] w-full object-cover"
      />
      {caption && (
        <figcaption className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-4 pt-10">
          <p className="text-xs text-slate-300">{caption}</p>
        </figcaption>
      )}
    </figure>
  );
}

export function FoundersGallery({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-brand-500/15 via-transparent to-brand-700/10 blur-md" />
      <div className="relative grid gap-4">
        <PhotoFrame
          src="/founders-handshake.png"
          alt="Uncas and Gavin, founders of GnU Detailing, shaking hands in their company polo shirts"
          caption="Uncas & Gavin · GnU Detailing"
          priority
          className="ring-1 ring-brand-500/20"
        />
        <PhotoFrame
          src="/founders-ski.png"
          alt="Uncas and Gavin on a ski lift in the Catskills"
          caption="Raised in the Catskills"
          className="ml-8 -mt-2 max-w-[85%] justify-self-end ring-1 ring-surface-border"
        />
      </div>
    </div>
  );
}
