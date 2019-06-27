// Copyright 2018, 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'

describe('Importing a profile/template with bad JSON', () => {
  beforeAll(async () => {
    await testUserLogin()
  })

  it('Displays an error message', async () => {
    expect.assertions(2)
    await page.goto('http://127.0.0.1:8888/templates')

    await page.waitForSelector('button#ImportProfile')
    await page.click('button#ImportProfile')

    await pupExpect(page).toMatch('Drag and drop a resource template file in the box')
    const fileInput = await page.$('.DropZone input[type="file"]')

    await fileInput.uploadFile('__tests__/__fixtures__/ddc_bad_json.json')

    await pupExpect(page).toMatchElement('div.alert-warning', { text: 'ERROR - CANNOT USE PROFILE/RESOURCE TEMPLATE: problem parsing JSON template' })
  })
})
