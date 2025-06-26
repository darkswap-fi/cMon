import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export default function TrendingPage() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      const res = await axios.get('https://api.coingecko.com/api/v3/search/trending');
      const mapped = res.data.coins.map(c => c.item);
      setCoins(mapped);
    };
    fetchTrending();
  }, []);

  return (
    <main className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Trending Coins This Week</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {coins.map((coin) => (
          <Link href={`/coin/${coin.id}`} key={coin.id}>
            <Card className="cursor-pointer hover:shadow transition">
              <CardContent>
                <h2 className="font-semibold">{coin.name}</h2>
                <p className="text-sm text-muted-foreground">{coin.symbol.toUpperCase()}</p>
                <p className="text-sm text-gray-500">Market Rank: {coin.market_cap_rank}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
