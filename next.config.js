/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['i.ibb.co'],
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "origins", value: "*" },
          { key: "Bypass-Tunnel-Reminder", value: "*" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Request-Methods",
            value: "POST, GET, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Authorization, Content-Type",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
