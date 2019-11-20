// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'

describe('Verify the resource template label is displayed in the editor', () => {
  beforeAll(async () => {
    await testUserLogin()
  })

  it('verifies that the title is in the header', async () => {
    expect.assertions(2)

    await pupExpect(page).toClick('a', { text: 'Note' })
    await pupExpect(page).toMatchElement('#resourceTemplate h3', { text: 'Note' })
  })
})
