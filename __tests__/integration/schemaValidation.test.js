// Copyright 2018 Stanford University see Apache2.txt for license
import pupExpect from 'expect-puppeteer'
import Config from '../../src/Config'

describe('Importing a profile/template with bad JSON', () => {

  it('Displays and error message', async () => {
    jest.setTimeout(5000);
    await page.goto(`http://127.0.0.1:8888/${Config.awsCognitoJWTHashForTest}`)

    await page.goto('http://127.0.0.1:8888/import')

    await page.waitForSelector('button#ImportProfile')
    await page.click('button#ImportProfile')

    await pupExpect(page).toMatch('Drag and drop a resource template file in the box')
    const fileInput = await page.$('.DropZone input[type="file"]')
    await fileInput.uploadFile("__tests__/__fixtures__/ddc_bad_json.json")

    jest.setTimeout(5000);
    pupExpect(page).toMatchElement('div.alert-warning', { text: 'ERROR - CANNOT USE PROFILE/RESOURCE TEMPLATE: problem parsing JSON template: SyntaxError: Unexpected token # in JSON at position 0' })
  })

})
