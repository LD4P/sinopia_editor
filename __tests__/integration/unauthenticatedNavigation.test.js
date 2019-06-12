// Copyright 2019 Stanford University see LICENSE for license
import expect from 'expect-puppeteer'
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
  })

  it('displays the login form', async () => {
    await page.waitForSelector('form.login-form')
  })

  it('does not display "Available Resource Templates in Sinopia"', async () => {
    await expect(page).not.toMatch('Available Resource Templates in Sinopia')
  })
})
