// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import Config from '../../src/Config'

describe('Expanding a resource property in a property panel', () => {
  beforeAll(async () => {
    jest.setTimeout(60000) // This seems to take around 10s in practice, but be generous, just in case
    await page.goto('http://127.0.0.1:8888/templates')

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

  it('loads up a resource template from the list of loaded templates', async () => {
    await pupExpect(page).toClick('a', { text: 'BIBFRAME Instance' })
    await pupExpect(page).toMatch('BIBFRAME Instance')
  })

  it('clicks on one of the property type rows to expand a nested resource', async () => {
    await pupExpect(page).toClick('a[data-id=\'hasInstance\']')
    await pupExpect(page).toMatchElement('h5', { text: 'BIBFRAME Instance' })
  })

  it('clicks on the PreviewRDF button and a modal appears', async () => {
    await pupExpect(page).toClick('button', { text: 'Preview RDF' })
    await pupExpect(page).toMatch('RDF Preview')
    await pupExpect(page).toMatch('If this looks good, then click Save and Publish')
  })

  it('presents a choice of group to save to', async () => {
    await pupExpect(page).toClick('button', { text: 'Save & Publish' })
    await pupExpect(page).toMatch('Which group do you want to save to?')
    await pupExpect(page).toMatch('Which group do you want to associate this record to?')
  })

  it('can click on the select menu to choose a group', async () => {
    await page.select('.group-select-options select', 'stanford')
    await pupExpect(page).toClick('button', { text: 'Save' })
  })

  it('for now has a dialog confirming the save function that can be dismissed', async () => {
    await pupExpect(page.on('dialog', (dialog) => {
      dialog.dismiss()
    }))
  })
})
