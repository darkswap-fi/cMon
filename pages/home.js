import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Line } from 'react-chartjs-2';
import { ChevronDown } from 'lucide-react';
import axios from 'axios';
import Link from 'next/link';
import '@/lib/chartConfig';

export default function HomePage() {
  const [coins, setCoins] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    const res = await axios.get('/api/proxy', {
      params: {
        path: 'coins/markets',
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 30,
        page: 1,
      },
    });
    const mapped = res.data.map(c => ({
      id: c.id,
      name: c.name,
      symbol: c.symbol.toUpperCase(),
      price: c.current_price,
      change: c.price_change_percentage_24h,
      image: c.image,
    }));
    setCoins(mapped);
  };

  const fetchChart = async (id) => {
    const res = await axios.get('/api/proxy', {
      params: {
        path: `coins/${id}/market_chart`,
        vs_currency: 'usd',
        days: 7,
      },
    });
    const prices = res.data.prices;
    setChartData({
      labels: prices.map(p => new Date(p[0]).toLocaleDateString()),
      datasets: [
        {
          label: `${id} price`,
          data: prices.map(p => p[1]),
          borderColor: '#3b82f6',
          tension: 0.1,
        },
      ],
    });
  };

  const handleCoinClick = (coin) => {
    setSelectedCoin(coin);
    fetchChart(coin.id);
  };

  const renderList = (title, items) => (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {items.map((coin) => (
          <Link href={`/coin/${coin.id}`} key={coin.id}>
            <Card className="cursor-pointer hover:shadow-lg transition">
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <img
                      src={coin.image}
                      alt={coin.symbol}
                      className="w-6 h-6 rounded-full"
                    />
                    <span>
                      {coin.name}
                      <span className="text-xs text-muted-foreground"> ({coin.symbol})</span>
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">${coin.price}</span>
                </div>
                <div
                  className={`text-sm ${
                    coin.change >= 0 ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  {coin.change?.toFixed(2)}%
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <main className="p-4 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Crypto Monitor Realtime Price</h1>
        <div className="relative group">
          <Button variant="outline" className="flex items-center">
            Explore <ChevronDown className="ml-2 w-4 h-4" />
          </Button>
          <div className="absolute bg-white shadow-lg rounded p-2 mt-2 z-10 hidden group-hover:block">
            <ul className="space-y-1 text-sm">
              <li><Link href="/market-cap">Top Market Cap</Link></li>
              <li><Link href="/trending">Top Trending</Link></li>
              <li><Link href="/gainers-losers">Gainers & Losers</Link></li>
              <li><Link href="/news">Top News Coin</Link></li>
            </ul>
          </div>
        </div>
      </header>

      {renderList('Top 10 Market Cap', coins.slice(0, 10))}
      {renderList('Top 10 New Coins', coins.slice(10, 20))}
      {renderList('Top 5 Gainers', coins.slice(20, 25))}
      {renderList('Top 5 Losers', coins.slice(25, 30))}

      {selectedCoin && chartData && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">{selectedCoin.name} Price Chart</h2>
          <Line
            data={chartData}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
      )}
    </main>
  );
}
