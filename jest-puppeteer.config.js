module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false',
    'args' : [ '--disable-web-security' ], // avoid CORS blocking verso requests
  },
  server: {
    command: 'node server-bfe.js',
    port: 8000,
  },
};
