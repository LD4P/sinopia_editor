// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'

describe('Previewing the RDF', () => {
  beforeAll(async () => {
    return await testUserLogin()
  })

  it('builds the rdf and has dialog for saving', async () => {
    expect.assertions(18)
    await pupExpect(page).toClick('a', { text: 'BIBFRAME Instance' })
    await pupExpect(page).toMatch('BIBFRAME Instance')

    // Click on one of the property type rows to expand a nested resource
    await pupExpect(page).toClick('a[data-id=\'title\']')
    await pupExpect(page).toMatchElement('h5', { text: 'Work Title' })

    // Fill in required element
    await pupExpect(page).toClick('a[data-id=\'mainTitle\']')
    await page.type('[placeholder=\'Preferred Title for Work (RDA 6.2.2, RDA 6.14.2) (BIBFRAME: Main title)\']', 'Hello')
    await page.keyboard.press('Enter')

    // Fill in required element
    await page.type('[placeholder=\'Agent Contribution\']', 'Typing')
    // wait until autosuggest has returned something to click on
    await page.waitForSelector('#rbt-menu-item-0')
    await pupExpect(page).toClick('#rbt-menu-item-0')

    // Fill in required element
    await page.type('[placeholder=\'Statement of Responsibility Relating to Title Proper (RDA 2.4.2)\'', 'World')
    await page.keyboard.press('Enter')

    // Click on the PreviewRDF button and a modal appears
    await pupExpect(page).toClick('button', { text: 'Preview RDF' })
    await pupExpect(page).toMatch('RDF Preview')
    await pupExpect(page).toMatch('If this looks good, then click Save and Publish')

    // Present a choice of group to save to from the RDFModal
    await pupExpect(page).toClick('#modal-save', { text: 'Save & Publish' })

    await pupExpect(page).toMatch('Which group do you want to save to?')
    await pupExpect(page).toMatch('Which group do you want to associate this record to?')

    // Click on the select menu to choose a group
    await page.select('.group-select-options select', 'stanford')
    await pupExpect(page).toClick('button', { text: 'Save' })

    // Presents a choice of group to save to when the non-modal Save and Publish is clicked
    await pupExpect(page).toClick('button', { text: 'Save & Publish' })
    await pupExpect(page).toMatch('Which group do you want to save to?')
    await pupExpect(page).toMatch('Which group do you want to associate this record to?')

    // Subsequent updates don't pop up the group modal
    await pupExpect(page).toClick('button', { text: 'Save & Publish' })
    await pupExpect(page).not.toMatch('Which group do you want to save to?')
  })
})
