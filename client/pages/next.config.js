module.exports = {
  webpackDevMiddleware: config =>{
    config.watchOptions.poll = 300;
    return config;
  }
};
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig