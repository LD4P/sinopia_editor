// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'

describe('A repeated propertyURI', () => {
  beforeAll(async () => {
    await testUserLogin()
  })

  it('renders the form with the right propertyLabels as the placeholders', async () => {
    expect.assertions(3)
    await pupExpect(page).toClick('a', { text: 'repeated propertyURI with differing propertyLabel' })
    await pupExpect(page).toMatchElement('div[data-label="Geographic Coverage 1"] input[placeholder="Geographic Coverage 1"]')
    await pupExpect(page).toMatchElement('div[data-label="Geographic Coverage 2"] input[placeholder="Geographic Coverage 2"]')
  })
})
