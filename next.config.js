/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['assets.coingecko.com'], // jika ingin pakai gambar coin
  },
};

module.exports = nextConfig;
