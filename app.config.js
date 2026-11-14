module.exports = ({ config }) => ({
  ...config,
  experiments: {
    ...config.experiments,
    ...(process.env.GITHUB_PAGES_BASE_PATH
      ? { baseUrl: process.env.GITHUB_PAGES_BASE_PATH }
      : {}),
  },
});
