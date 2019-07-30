// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'
import { incompleteFieldsForBibframeInstance } from './previewRDFHelper'

describe('Previewing the RDF', () => {
  beforeAll(async () => {
    await testUserLogin()
  })

  beforeEach(async () => {
    await page.goto('http://127.0.0.1:8888/templates')
    await incompleteFieldsForBibframeInstance()
  })

  it('builds the rdf and displays validation errors after attempting to save', async () => {
    expect.assertions(8) // An additional assertion is done in incompleteFieldsForBibframeInstance

    // Need to change something
    await pupExpect(page).toMatchElement('[placeholder=\'Statement of Responsibility Relating to Title Proper (RDA 2.4.2)\'', 'World')
    await pupExpect(page).toFill('[placeholder=\'Statement of Responsibility Relating to Title Proper (RDA 2.4.2)\'', 'World')
    await page.keyboard.press('Enter')

    // Click on the PreviewRDF button and a modal appears
    await pupExpect(page).toClick('button', { text: 'Preview RDF' })
    await pupExpect(page).toMatch('RDF Preview')
    await pupExpect(page).toMatch('If this looks good, then click Save and Publish')

    // Present a choice of group to save to from the RDFModal
    await pupExpect(page).toClick('#modal-save', { text: 'Save & Publish' })
    await pupExpect(page).toMatchElement('div.alert')
  })

  it('does not display the alert for a reloaded template', async () => {
    expect.assertions(2) // An additional assertion is done in incompleteFieldsForBibframeInstance
    await pupExpect(page).not.toMatchElement('div.alert')
  })
})
