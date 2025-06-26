// pages/api/proxy.js
import axios from 'axios';

const cache = new Map();

export default async function handler(req, res) {
  const { path, ...params } = req.query;

  if (!path) return res.status(400).json({ error: 'Missing path parameter' });

  const cacheKey = `${path}_${JSON.stringify(params)}`;
  const cacheTTL = 60 * 1000; // cache 1 menit
  const now = Date.now();

  // ✅ Cek cache dulu
  if (cache.has(cacheKey)) {
    const { timestamp, data } = cache.get(cacheKey);
    if (now - timestamp < cacheTTL) {
      return res.status(200).json(data); // kirim dari cache
    }
  }

  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/${path}`, {
      params,
    });

    // ✅ Simpan ke cache
    cache.set(cacheKey, {
      timestamp: now,
      data: response.data,
    });

    res.status(200).json(response.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data || { message: 'Proxy Error' };
    res.status(status).json({
      status: {
        error_code: status,
        error_message: message?.error || message?.message || 'API Error',
      },
    });
  }
}
