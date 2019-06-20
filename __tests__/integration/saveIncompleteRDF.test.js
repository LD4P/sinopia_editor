// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'
import { incompleteFieldsForBibframeInstance } from './previewRDFHelper'

describe('Previewing the RDF', () => {
  beforeAll(async () => {
    return await testUserLogin()
  })

  beforeEach(async () => {
    return await incompleteFieldsForBibframeInstance()
  })

  it('builds the rdf and has dialog for saving', async () => {
    expect.assertions(6) // An additional assertion is done in incompleteFieldsForBibframeInstance

    // Click on the PreviewRDF button and a modal appears
    await pupExpect(page).toClick('button', { text: 'Preview RDF' })
    await pupExpect(page).toMatch('RDF Preview')
    await pupExpect(page).toMatch('If this looks good, then click Save and Publish')

    // Present a choice of group to save to from the RDFModal
    await pupExpect(page).toClick('#modal-save', { text: 'Save & Publish' })
    await pupExpect(page).toMatchElement('div.alert')
  })
})
