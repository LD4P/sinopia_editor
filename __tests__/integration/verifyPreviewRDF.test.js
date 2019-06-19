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

  it('builds the rdf and verifies the expected content', async () => {
    expect.assertions(6) // An additional assertion is done in previewRDFSetup

    // Click on the PreviewRDF button and a modal appears
    await pupExpect(page).toClick('button', { text: 'Preview RDF' })
    await pupExpect(page).toMatch('RDF Preview')
    const rdfOut = await page.$eval('pre', e => e.textContent) // Copy the text from the modal into a variable

    // Verify that the values entered in previewRDFSetup show up in the generated graph
    await expect(rdfOut).toMatch('Hello')
    await expect(rdfOut).toMatch('World')
    await expect(rdfOut).toMatch('http://id.loc.gov/authorities/subjects/sh85127327') // This is the Stanford family URI
  })
})
