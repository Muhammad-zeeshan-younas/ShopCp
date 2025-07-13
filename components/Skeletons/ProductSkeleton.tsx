// components/skeletons.tsx
export function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-lg border shadow-sm overflow-hidden">
          <div className="aspect-square bg-gray-200 animate-pulse" />
          <div className="p-4 space-y-2">
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="h-10 bg-gray-200 rounded animate-pulse mt-4" />
          </div>
        </div>
      ))}
    </div>
  );
}
