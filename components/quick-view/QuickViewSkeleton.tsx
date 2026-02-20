export function QuickViewSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 animate-pulse">
      <div className="aspect-[4/5] bg-zinc-200" />
      <div className="flex flex-col justify-center gap-4 p-6 md:p-8">
        <div className="h-8 w-2/3 rounded bg-zinc-200" />
        <div className="h-6 w-1/3 rounded bg-zinc-200" />
        <div className="h-4 w-full rounded bg-zinc-200" />
        <div className="h-4 w-5/6 rounded bg-zinc-200" />
        <div className="h-4 w-4/6 rounded bg-zinc-200" />
      </div>
    </div>
  );
}
