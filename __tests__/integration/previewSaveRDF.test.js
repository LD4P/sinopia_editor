// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'
import { previewRDFSetup } from './previewRDFHelper'

describe('Previewing the RDF', () => {
  beforeAll(async () => {
    return await testUserLogin()
  })

  beforeEach(async () => {
    return await previewRDFSetup()
  })

  it('builds the rdf and has dialog for saving', async () => {
    expect.assertions(13) // An additional assertion is done in previewRDFSetup

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
