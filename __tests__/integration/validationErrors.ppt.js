// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'
import { incompleteFieldsForBibframeInstance } from './previewRDFHelper'

describe('Validation errors', () => {
  beforeAll(async () => {
    await testUserLogin()
    await incompleteFieldsForBibframeInstance()
  })

  it('validates', async () => {
    expect.assertions(7)

    // Make a change
    await pupExpect(page).toClick('button.btn-remove[data-id=\'content\']', { text: 'Remove' })

    // Request validation
    await pupExpect(page).toClick('button:enabled#editor-save', { text: 'Save' })

    await pupExpect(page).toMatch('There was a problem saving this resource.')
    await pupExpect(page).toMatch('BIBFRAME Instance > Agent Contribution: Required')
    await pupExpect(page).toMatchElement('span.help-block', { text: 'Required' })
    await pupExpect(page).toMatchElement('div.has-error')
  })
})
