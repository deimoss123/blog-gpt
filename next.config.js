const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: false,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com'],
  },
  experimental: {
    appDir: true,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
