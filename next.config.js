// next.config.js
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'firebase-admin': false
      };
    }
    return config;
  },
  experimental: {
    runtime: 'nodejs' // Force Node.js runtime
  },
  serverExternalPackages: ['firebase-admin']
};