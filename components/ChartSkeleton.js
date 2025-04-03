export default function ChartSkeleton({ length, width }) {
    return (
      <div className="flex items-end justify-center space-x-2 h-full w-full relative animate-pulse">
        {Array.from({ length: length }).map((_, i) => (
          <div
            key={i}
            className={`w-${width} ${i % 2 === 0 ? 'bg-neutral-700' : 'bg-neutral-600'} rounded`}
            style={{ height: `${30 + (i % 3) * 15}%` }} // Alternating heights
          ></div>
        ))}
  
        {/* X-Axis Placeholder */}
        <div className="absolute bottom-0 right-0 w-full h-1 bg-neutral-500 rounded"></div>
      </div>
    );
  }