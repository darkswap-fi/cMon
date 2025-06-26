import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function NewsPage() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get('https://api.coinstats.app/public/v1/news?skip=0&limit=20&category=crypto');
        setNews(res.data.news);
      } catch (err) {
        console.error('Error fetching news', err);
      }
    };
    fetchNews();
  }, []);

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Top Crypto News</h1>
      <div className="space-y-4">
        {news.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <Link href={item.link} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold hover:underline">
                {item.title}
              </Link>
              <p className="text-sm text-muted-foreground mt-1">{item.source} • {new Date(item.pubDate).toLocaleDateString()}</p>
              <p className="mt-2 text-sm">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
