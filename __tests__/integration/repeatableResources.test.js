// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import Config from '../../src/Config'

describe('Adding new embedded Resource Templates', () => {
  beforeAll(async () => {
    jest.setTimeout(60000) // this seems to take around 10s in practice, but be generous, just in case
    await page.goto('http://127.0.0.1:8888/templates')

    // attempt to enter and submit login info
    try {
      await page.waitForSelector('form.login-form')
      await page.type('form.login-form input[name=username]', Config.cognitoTestUserName)
      await page.type('form.login-form input[name=password]', Config.cognitoTestUserPass)
      await page.click('form.login-form button[type=submit]')
    } catch (error) {
      console.info(error)
    }

    // sign out button should only show up after successful login
    await page.waitForSelector('button.signout-btn')
  })

  it('loads up a resource template from the list of loaded templates', async () => {
    await pupExpect(page).toClick('a', { text: 'BIBFRAME Instance' })
    await pupExpect(page).toMatch('BIBFRAME Instance')
  })

  // TODO: Simplify CSS selectors in the tests below, see ticket #573
  it('clicks on an AddButton in Notes about the Instance and looks for a second resource template', async () => {
    await pupExpect(page).toClick('div.panel:nth-child(5) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > section:nth-child(2) > div:nth-child(1) > button:nth-child(1)')
    await pupExpect(page).toMatchElement('div.panel:nth-child(5) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > h4:nth-child(2)', { text: 'Note' })
  })

  it('clicks on a nested property with an embedded Note resource template and then clicks on the AddButton for a second resource template', async () => {
    await pupExpect(page).toClick('a[data-id=\'note\']')
    await pupExpect(page).toClick('.col-sm-4 > div:nth-child(1) > button:nth-child(1)')
    await pupExpect(page).toMatchElement('div.panel:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(2) > h5:nth-child(2)',
      { text: 'Note' })
  })

  it('checks that a non-repeatable resource template\'s AddButton is disabled', async () => {
    await pupExpect(page).toMatchElement('div.panel:nth-child(7) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > section:nth-child(2) > div:nth-child(1) > button:nth-child(1)',
      { disabled: true })
  })
})
