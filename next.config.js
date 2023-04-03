const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: false,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
};

module.exports = withBundleAnalyzer(nextConfig);
