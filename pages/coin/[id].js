import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import '@/lib/chartConfig';

export default function CoinDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCoinDetail();
      fetchChartData();
    }
  }, [id]);

  const fetchCoinDetail = async () => {
    const res = await axios.get('/api/proxy', {
      params: {
        path: `coins/markets`,
        vs_currency: 'usd',
        ids: id,
      },
    });
    if (res.data.length > 0) {
      const c = res.data[0];
      setCoin({
        id: c.id,
        name: c.name,
        symbol: c.symbol.toUpperCase(),
        price: c.current_price,
        change: c.price_change_percentage_24h,
        image: c.image,
      });
    }
  };

  const fetchChartData = async () => {
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

  if (!coin || !chartData) return <div className="p-4">Loading...</div>;

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <img src={coin.image} alt={coin.symbol} className="w-10 h-10 rounded-full" />
        <div>
          <h1 className="text-2xl font-bold">
            {coin.name} <span className="text-sm text-muted-foreground">({coin.symbol})</span>
          </h1>
          <p className="text-muted-foreground">${coin.price}</p>
          <p className={`text-sm ${coin.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {coin.change?.toFixed(2)}%
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">7-Day Price Chart</h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
          },
        }}
      />
    </main>
  );
}
