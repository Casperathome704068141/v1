
import webpack from 'webpack';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Map "node:" specifiers to browser-safe shims
    config.resolve.alias = {
      ...config.resolve.alias, // Keep existing aliases
      ...config.resolve.alias,
      'node:process': 'process/browser',
      'node:buffer': 'buffer',
      'node:stream': 'stream-browserify',
      'node:util': 'util', // Add util shim
      'node:events': 'events', // Add events shim
      process: 'process/browser',
      // buffer: 'buffer', // buffer is already defined above, no need to repeat
      buffer: 'buffer',
    };

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        process: require.resolve('process/browser'),
        buffer: require.resolve('buffer/'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util/'), // Add util fallback
        events: require.resolve('events/'), // Add events fallback
      };
    }

    config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
      })
    );
    return config;
  },
};

export default nextConfig;
