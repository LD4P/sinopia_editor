// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'

describe('Loading RDF', () => {
  beforeAll(async () => {
    return await testUserLogin()
  })

  it('loads the rdf into state and renders the editor', async () => {
    expect.assertions(8)

    // Click on the Load tab
    await pupExpect(page).toClick('a', { text: 'Load RDF' })
    await pupExpect(page).toMatch('Load RDF into Editor')

    // Fill out the form and click submit
    await expect(page).toFill('form#loadForm textarea[id="resourceTextArea"]', '<http://abc123> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Note> . <http://abc123> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:Note" . <http://abc123> <http://www.w3.org/2000/01/rdf-schema#label> "foo"@eng .')
    await expect(page).toFill('form#loadForm input[id="uriInput"]', 'http://abc123')
    await pupExpect(page).toClick('form#loadForm button[type="submit"]')

    // Note should be rendered in editor
    await pupExpect(page).not.toMatch('Load RDF into Editor')
    await pupExpect(page).toMatch('Note')
    await pupExpect(page).toMatch('foo')
  })
})
