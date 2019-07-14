// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'

describe('A repeated propertyURI', () => {
  beforeAll(async () => {
    await testUserLogin()
  })

  it('renders an error message', async () => {
    expect.assertions(2)
    await pupExpect(page).toClick('a', { text: 'repeated propertyURI with differing propertyLabel' })
    await pupExpect(page).toMatch('There was a problem retrieving rt:repeated:propertyURI:propertyLabel: Repeated property templates with same property URI (http://id.loc.gov/ontologies/bibframe/geographicCoverage) are not allowed.')
  })
})
