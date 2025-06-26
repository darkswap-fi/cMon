import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

export default function MarketCapPage() {
  const [coins, setCoins] = useState([]);

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
      setCoins(res.data);
    };
    fetchData();
  }, []);

  return (
    <main className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Top Market Cap Coins</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {coins.map((coin) => (
          <Link href={`/coin/${coin.id}`} key={coin.id}>
            <Card className="cursor-pointer hover:shadow-md transition">
              <CardContent>
                <h2 className="font-semibold">{coin.name}</h2>
                <p className="text-sm text-muted-foreground">${coin.current_price}</p>
                <p className={`text-sm ${coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {coin.price_change_percentage_24h?.toFixed(2)}%
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
