'use client';

import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';
import NewsSkeleton from '../NewsSkeleton';

export default function NewsSection() {
  const { articles, loading, error } = useSelector((state) => state.news);

  if (error) {
    return <div>Error loading news: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Crypto News</h2>
      <div className="grid gap-4">
        {loading? (
          <NewsSkeleton />
        ):(
          <>
        {articles.map((article, index) => (
          <Card key={index} className="overflow-x-auto hover:shadow-md transition-all duration-100">
            <CardHeader className="flex flex-row items-center space-x-2 pb-2">
              <Newspaper className="h-4 w-4" />
              <CardTitle className="text-sm font-medium line-clamp-1">
                {article.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {article.description}
              </p>
              <div className="mt-2 flex justify-between items-center text-xs">
                <span className="text-muted-foreground">
                  {new Date(article.pubDate).toLocaleDateString('en-IN')}
                </span>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline cursor-pointer"
                >
                  Read more
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
        </>
      )}
      </div>
    </div>
  );
}