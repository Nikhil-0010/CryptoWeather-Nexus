export default function ChartSkeleton({ length, width }) {
    return (
      <div className="flex items-end justify-center gap-2 h-full max-w-screen relative animate-pulse">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`w-full ${i % 2 === 0 ? 'bg-neutral-200 dark:bg-neutral-700' : 'bg-neutral-100 dark:bg-neutral-600'} rounded`}
            style={{ height: `${30 + (i % 3) * 15}%` }} // Alternating heights
          ></div>
        ))}
  
        {/* X-Axis Placeholder */}
        <div className="absolute bottom-0 right-0 w-full h-1 bg-neutral-300 dark:bg-neutral-500 rounded"></div>
      </div>
    );
  }