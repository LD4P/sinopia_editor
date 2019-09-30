// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'

describe('Errors with Misconfigured Property Templates', () => {
  beforeAll(async () => {
    await testUserLogin()
  })

  beforeEach(async () => {
    await page.goto('http://127.0.0.1:8888/templates')
    await page.waitForSelector('.react-bootstrap-table')
  })

  it('lookup type misconfigured with valueTemplateRefs', async () => {
    // expect.assertions(3)
    await pupExpect(page).toClick('a[href="/editor"]', { text: 'test lookup type misconfigured with valueTemplateRefs' })
    await pupExpect(page).toClick('button.btn-add[data-id="lookup1"]')
    await pupExpect(page).toMatch('This propertyTemplate is misconfigured.')
  })
})
