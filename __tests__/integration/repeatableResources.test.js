// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'

describe('Adding new embedded Resource Templates', () => {
  beforeAll(async () => {
    await testUserLogin()
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
    await pupExpect(page).toMatchElement('div.panel-body > div > div:nth-child(2) > div:nth-child(3) > div.rOutline-property > div:nth-child(2) > div.row > section.col-sm-8> h5',
      { text: 'Note' })
  })

  it('checks that a non-repeatable resource template\'s AddButton is disabled', async () => {
    await pupExpect(page).toMatchElement('div.panel:nth-child(7) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > section:nth-child(2) > div:nth-child(1) > button:nth-child(1)',
      { disabled: true })
  })
})
