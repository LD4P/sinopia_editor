// Copyright 2018 Stanford University see LICENSE for license

module.exports = {
  browser: 'firefox',
  launch: {
    headless: process.env.HEADLESS !== 'false',
    args: ['--disable-web-security'],
  },
  server: {
    command: 'USE_FIXTURES=true npm run dev-start',
    port: 8888,
    launchTimeout: 10000,
  },
}
