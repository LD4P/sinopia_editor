// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'

describe('Leaving the editor', () => {
  beforeAll(async () => {
    await testUserLogin()
  })

  it('prompts the user before leaving', async () => {
    expect.assertions(8)

    // Load up a Bibframe Instance
    await pupExpect(page).toClick('a', { text: 'BIBFRAME Instance' })
    await pupExpect(page).toMatchElement('a', { text: 'Editor' })

    const dialog1 = await expect(page).toDisplayDialog(async () => {
      await pupExpect(page).toClick('a', { text: 'Load RDF' })
    })
    await dialog1.dismiss()
    await pupExpect(page).not.toMatch('Load by URI')

    const dialog2 = await expect(page).toDisplayDialog(async () => {
      await pupExpect(page).toClick('a', { text: 'Load RDF' })
    })
    await dialog2.accept()
    await pupExpect(page).toMatch('Load by URI')
  })
})
