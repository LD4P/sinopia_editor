// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'

describe('Adding new embedded Resource Templates', () => {
  beforeAll(async () => {
    await testUserLogin()
    await pupExpect(page).toClick('a', { text: 'BIBFRAME Instance' })
    await pupExpect(page).toMatch('BIBFRAME Instance')
  })

  describe('one level of nested resourceTemplate (Notes about the Instance)', () => {
    it('clicking AddButton adds second resource template', async () => {
      expect.assertions(6) // Includes 2 in beforeAll
      // Add Notes about the instance
      await pupExpect(page).toClick('div[data-label="Notes about the Instance"] button')
      const panelBodySel = 'div[data-label="Notes about the Instance"] > div.card-body'
      let noteRtOutlines = await page.$$(`${panelBodySel} .rtOutline`)

      expect(noteRtOutlines.length).toEqual(1)
      await pupExpect(page).toClick(`${panelBodySel} button`) // Add button
      noteRtOutlines = await page.$$(`${panelBodySel} .rtOutline`)
      expect(noteRtOutlines.length).toEqual(2)
    })
  })

  describe('two levels of nested resourceTemplates (Instance of -> Notes about the Work)', () => {
    it('clicking AddButton adds second resource template', async () => {
      expect.assertions(4)
      await pupExpect(page).toClick('div[data-label=\'Instance of\'] button.btn-add[data-id=\'note\']')

      const ptOutlineSel = 'div[data-label="Instance of"] div.rtOutline[data-label="Notes about the Work"]'
      let noteRtOutlines = await page.$$(`${ptOutlineSel} div.rtOutline`)
      expect(noteRtOutlines.length).toEqual(1)

      await pupExpect(page).toClick(`${ptOutlineSel} button.btn-add-another`) // Add button
      noteRtOutlines = await page.$$(`${ptOutlineSel} div.rtOutline`)
      expect(noteRtOutlines.length).toEqual(2)
    })
  })

  it('AddButton disabled for non-repeatable resourceTemplate (Item Information -> Barcode)', async () => {
    expect.assertions(2)
    // Add Item Information
    await pupExpect(page).toClick('div[data-label="Item Information"] button')
    await pupExpect(page).toMatchElement('div[data-label="Item Information"] > div.card-body button', { disabled: true })
  })
})
