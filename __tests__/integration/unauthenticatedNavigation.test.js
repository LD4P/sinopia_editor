// Copyright 2019 Stanford University see LICENSE for license
import expect from 'expect-puppeteer'
import 'isomorphic-fetch'

describe('When an unauthenticated user tries to access resource templates', () => {
  beforeAll(async () => {
    jest.setTimeout(60000) // this seems to take around 10s in practice, but be generous, just in case
    await page.goto('http://127.0.0.1:8888/templates')

    // Attempt to logout
    // This try block is necessary to avoid failing after logout
    try {
      await page.waitForSelector('button.signout-btn')
      await page.click('button.signout-btn')
    } catch (error) {
      console.info(error)
    }
  })

  it('does not display "Available Resource Templates in Sinopia"', async () => {
    await expect(page).not.toMatch('Available Resource Templates in Sinopia')
  })
})
