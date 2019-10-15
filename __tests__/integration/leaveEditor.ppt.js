// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'

describe('Leaving the editor', () => {
  beforeAll(async () => {
    await testUserLogin()
  })

  it('prompts the user before leaving', async () => {
    expect.assertions(14)

    await page.setViewport({
      width: 1822,
      height: 961,
    })

    // Load up a Bibframe Instance
    await pupExpect(page).toClick('a', { text: 'BIBFRAME Instance' })
    await pupExpect(page).toMatchElement('button#editor-save')

    // Can navigate away, since no changes
    await pupExpect(page).toClick('a.nav-link', { text: 'Load RDF' })
    await pupExpect(page).toMatch('Load by URI')

    // Navigate back
    await pupExpect(page).toClick('a.nav-link', { text: /^Editor$/ })
    await pupExpect(page).toMatchElement('button#editor-save')

    // Change something
    await pupExpect(page).toMatchElement('[placeholder=\'Statement of Responsibility Relating to Title Proper (RDA 2.4.2)\'', 'World')
    await pupExpect(page).toFill('[placeholder=\'Statement of Responsibility Relating to Title Proper (RDA 2.4.2)\'', 'World')
    await page.keyboard.press('Enter')

    const dialog1 = await expect(page).toDisplayDialog(async () => {
      await pupExpect(page).toClick('a.nav-link', { text: 'Load RDF' })
    })
    await dialog1.dismiss()
    await pupExpect(page).not.toMatch('Load by URI')

    const dialog2 = await expect(page).toDisplayDialog(async () => {
      await pupExpect(page).toClick('a.nav-link', { text: 'Load RDF' })
    })
    await dialog2.accept()
    await pupExpect(page).toMatch('Load by URI')
  })
})
