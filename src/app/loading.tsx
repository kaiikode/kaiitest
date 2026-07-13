export default function Loading() {
  return (
    <main
      className="min-h-screen bg-[#f6f1e7] p-6 sm:p-10"
      aria-label="Loading Padua Wedding Planning"
    >
      <div className="mx-auto max-w-[1200px] animate-pulse">
        <div className="h-5 w-40 bg-[#d8cdbd]" />
        <div className="mt-6 h-14 w-2/3 bg-[#e2d9ca]" />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <div className="h-48 bg-[#e2d9ca]" />
          <div className="h-48 bg-[#e2d9ca]" />
          <div className="h-48 bg-[#e2d9ca]" />
        </div>
      </div>
    </main>
  );
}
