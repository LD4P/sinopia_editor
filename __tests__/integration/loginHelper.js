// Copyright 2019 Stanford University see LICENSE for license

import Config from 'Config'

// The qaResponse is the single `Stanford family` result that we are checking for in the integration test
const qaResponse = [{ uri: 'http://id.loc.gov/authorities/subjects/sh85127327', id: 'http://id.loc.gov/authorities/subjects/sh85127327', label: 'Stanford family' }]

export async function testUserLogin() {
  jest.setTimeout(60000) // Takes around 10s in practice, but be generous, just in case

  // This captures the requests sent to the authorities endpoint at lookup.ld4l.org in order
  // To avoid depending on network services during integration testing.
  await page.setRequestInterception(true)
  page.on('request', (interceptedRequest) => {
    if (interceptedRequest.url().includes('lookup.ld4l.org/authorities/search/linked_data/locsubjects_ld4l_cache/person')) {
      interceptedRequest.respond({
        status: 200,
        contentType: 'application/json; charset=utf-8',
        body: JSON.stringify(qaResponse),
      })
    } else interceptedRequest.continue() // If the url isn't the specific one above, pass the request on
  })

  await page.goto('http://127.0.0.1:8888/templates')

  try {
    await page.waitForSelector('form.login-form')
    await page.type('form.login-form input[name=username]', Config.cognitoTestUserName)
    await page.type('form.login-form input[name=password]', Config.cognitoTestUserPass)
    await page.click('form.login-form button[type=submit]')
  } catch (error) {
    console.info(error)
  }

  // Sign out button should only show up after successful login
  await page.waitForSelector('button.signout-btn')
  jest.setTimeout(5000) // Reset timeout to default
}

export async function testUserLogout() {
  jest.setTimeout(60000) // Takes around 10s in practice, but be generous, just in case
  await page.goto('http://127.0.0.1:8888/templates')

  await page.waitForSelector('button.signout-btn')
  await page.click('button.signout-btn')
  jest.setTimeout(5000) // Reset timeout to default
}
