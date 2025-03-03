/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve Node.js built-in modules on the client
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        http2: false,
        perf_hooks: false,
        path: false,
        '@neondatabase/serverless': false,
        // Add stream/web to the fallback list
        'stream': false,
        'stream/web': false,
        'util': false,
        'buffer': false,
        'crypto': false
      };
    }
    return config;
  },
  transpilePackages: ['lexical-editor-easy'],
};

module.exports = nextConfig;
