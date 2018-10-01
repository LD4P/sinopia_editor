module.exports = {
  launch: {
    headless: process.env.CI === 'true',
  },
  server: {
    command: 'node server-bfe.js',
    port: 8000,
  },
};
