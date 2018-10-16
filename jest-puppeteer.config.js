module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false',
  },
  server: {
    command: 'node server-bfe.js',
    port: 8000,
  },
};
