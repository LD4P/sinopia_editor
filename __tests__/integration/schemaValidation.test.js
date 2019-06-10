// Copyright 2018 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import Config from '../../src/Config'

describe('Importing a profile/template with bad JSON', () => {
  beforeAll(async () => {
    jest.setTimeout(60000) // This seems to take around 10s in practice, but be generous, just in case
    await page.goto('http://127.0.0.1:8888/')

    // Attempt to enter and submit login info
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
  })

  it('Displays an error message', async () => {
    await page.goto('http://127.0.0.1:8888/templates')

    await page.waitForSelector('button#ImportProfile')
    await page.click('button#ImportProfile')

    await pupExpect(page).toMatch('Drag and drop a resource template file in the box')
    const fileInput = await page.$('.DropZone input[type="file"]')

    await fileInput.uploadFile('__tests__/__fixtures__/ddc_bad_json.json')

    await pupExpect(page).toMatchElement('div.alert-warning', { text: 'ERROR - CANNOT USE PROFILE/RESOURCE TEMPLATE: problem parsing JSON template' })
  })
})
