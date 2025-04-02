'use client';

import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

export default function NewsSection() {
  const { articles, loading, error } = useSelector((state) => state.news);

  if (loading) {
    return <div>Loading news...</div>;
  }

  if (error) {
    return <div>Error loading news: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Crypto News</h2>
      <div className="grid gap-4">
        {articles.map((article, index) => (
          <Card key={index}>
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
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Read more
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}