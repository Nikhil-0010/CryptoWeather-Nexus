import React from 'react';
const NewsSkeleton = React.memo(() => {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse p-4 border rounded-lg dark:bg-neutral-800 space-y-3">
            <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
            <div className="h-4 bg-neutral-100 dark:bg-neutral-600 rounded w-full"></div>
            <div className="h-4 bg-neutral-100 dark:bg-neutral-600 rounded w-5/6"></div>
          </div>
        ))}
      </div>
    );
  });
  
  export default NewsSkeleton;
  