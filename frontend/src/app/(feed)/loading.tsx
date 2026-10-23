
export default function Loading() {
  return (
    <div className="grid animate-pulse gap-6 lg:grid-cols-[260px_minmax(0,1fr)]" aria-busy="true" aria-label="Chargement">
      <div className="hidden space-y-2 lg:block">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-9 rounded-xl bg-line" />
        ))}
      </div>
      <div className="space-y-3">
        <div className="h-10 w-1/2 rounded-xl bg-line" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-line" />
        ))}
      </div>
    </div>
  );
}
