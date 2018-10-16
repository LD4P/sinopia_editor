module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false',
    'args' : [ '--disable-web-security' ] // in order to access verso api
  },
  server: {
    command: 'node server-bfe.js',
    port: 8000,
  },
};
