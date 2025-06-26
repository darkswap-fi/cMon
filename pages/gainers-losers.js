import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export default function GainersLosersPage() {
  const [gainers, setGainers] = useState([]);
  const [losers, setLosers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 100,
          page: 1
        }
      });
      const sorted = res.data.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
      setGainers(sorted.slice(0, 5));
      setLosers(sorted.slice(-5).reverse());
    };
    fetchData();
  }, []);

  const renderList = (title, list, type) => (
    <div className="mb-6">
      <h2 className={`text-xl font-bold mb-2 ${type === 'gainer' ? 'text-green-600' : 'text-red-600'}`}>{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {list.map((coin) => (
          <Link href={`/coin/${coin.id}`} key={coin.id}>
            <Card className="cursor-pointer hover:shadow transition">
              <CardContent>
                <h3 className="font-semibold">{coin.name}</h3>
                <p className="text-sm text-muted-foreground">${coin.current_price}</p>
                <p className={`text-sm ${coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <main className="p-4 max-w-6xl mx-auto">
      {renderList('Top 5 Gainers (24h)', gainers, 'gainer')}
      {renderList('Top 5 Losers (24h)', losers, 'loser')}
    </main>
  );
}
