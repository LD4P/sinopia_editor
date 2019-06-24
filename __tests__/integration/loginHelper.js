// Copyright 2019 Stanford University see LICENSE for license

import Config from 'Config'

export async function testUserLogin() {
  jest.setTimeout(60000) // Takes around 10s in practice, but be generous, just in case
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
