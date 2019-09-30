// Copyright 2019 Stanford University see LICENSE for license
import pupExpect from 'expect-puppeteer'
import 'isomorphic-fetch'
import { testUserLogout } from './loginHelper'

describe('When an unauthenticated user tries to access resource templates', () => {
  beforeAll(async () => {
    jest.setTimeout(60000) // This seems to take around 10s in practice, but be generous, just in case
    await page.goto('http://127.0.0.1:8888/templates')

    try {
      await testUserLogout()
    } catch (error) {
      // Avoid failing after logout
    }
    await page.waitForSelector('form.login-form') // Waiting for login form
  })

  /*
  * Skipping this test because:
  * 1. User logout is known wonky: https://github.com/LD4P/sinopia_editor/issues/556
  * 2. This is passing locally, but failing in Circle.
  */
  it.skip('does not display "Available Resource Templates in Sinopia"', async () => {
    expect.assertions(1)
    await pupExpect(page).not.toMatch('Available Resource Templates in Sinopia')
  })
})
