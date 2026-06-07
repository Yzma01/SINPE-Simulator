/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL,
    GET_API_KEY_URL: process.env.GET_API_KEY_URL,
  },

  serverRuntimeConfig: {
    MONGODB_URI: process.env.MONGODB_URI,
  },

  publicRuntimeConfig: {
    apiUrl:
      process.env.NODE_ENV === "development"
        ? "https://localhost:5000"
        : "https://ro-ma-sys-server.vercel.app",
  },
};

export default nextConfig;
