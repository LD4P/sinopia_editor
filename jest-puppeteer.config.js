module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false',
    'args' : [ '--disable-web-security' ],
  },
  server: {
    command: 'node server.js',
    port: 8000,
  },
};
