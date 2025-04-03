export default function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-100 text-neutral-800 dark:bg-gray-800 dark:text-white p-2 rounded shadow-md">
          {payload.map((entry, index) => (
              <p key={index} className="font-bold text-sm">
              {entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}: {entry.name==='temperature'? Number(entry.value).toFixed(1) + ' ℃' : entry.name==='humidity'? entry.value : Number(entry.value).toFixed(4) }
            </p>
          ))}
          <p className="text-xs">{label}</p>
        </div>
      );
    }
    return null;
  };
  