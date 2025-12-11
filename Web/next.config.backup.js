/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Use static export for faster deployment
  output: 'export',
  
  // Speed up builds for deployment
  typescript: {
    ignoreBuildErrors: true, // Temporarily skip type checking to speed up build
  },
  eslint: {
    ignoreDuringBuilds: true, // Skip ESLint during build for speed
  },
  
  // Enable experimental features
  experimental: {
    serverActions: {
      allowedOrigins: ['rangis.net', '*.vercel.app'],
    },
    // Turbo mode for faster builds
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Webpack configuration for blockchain libraries
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        path: require.resolve('path-browserify'),
      };
    }
    
    // Handle audio processing
    config.module.rules.push({
      test: /\.(mp3|wav|ogg)$/,
      type: 'asset/resource',
    });
    
    return config;
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_APP_NAME: 'RangisNet',
    NEXT_PUBLIC_NETWORK: 'fuji',
    NEXT_PUBLIC_TELEPORTER_MESSENGER: '0x253b2784c75e510dD0fF1da844684a1aC0aa5fcf',
  },
  
  // Headers for security and Web3 compatibility
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
  
  // Image optimization
  images: {
    domains: ['ipfs.io', 'gateway.pinata.cloud'],
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
