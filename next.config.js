const relay = require('./relay.config.json');

module.exports = {
  swcMinify: true,
  poweredByHeader: false,
  reactStrictMode: true,
  compiler: {
    relay: {
      src: relay.src,
      artifactDirectory: relay.artifactDirectory,
      language: relay.language,
    },
    externalDir: true,
  },
  experimental: {
    runtime: 'nodejs',
    concurrentFeatures: true,
  },
  serverRuntimeConfig: {
    projectRoot: __dirname,
  },
};
