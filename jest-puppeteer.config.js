// Copyright 2018 Stanford University see Apache2.txt for license

module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false',
    args : [ '--disable-web-security' ]
  },
  server: {
    command: 'SPOOF_SINOPIA_SERVER=true npm run dev-start',
    port: 8888,
    launchTimeout: 10000
  }
}
