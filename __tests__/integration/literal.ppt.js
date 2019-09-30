// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'

describe('RDF from literal property templates', () => {
  beforeAll(async () => {
    await testUserLogin()
    await page.goto('http://127.0.0.1:8888/templates')
    await page.waitForSelector('.table')
    await page.setViewport({
      width: 1822,
      height: 961,
    })
  })

  it('enter a note value', async () => {
    expect.assertions(4)
    await pupExpect(page).toClick('a[href="/editor"]', { text: 'Note' })
    await pupExpect(page).toClick('button.btn-add')
    await pupExpect(page).toFill('input[placeholder=\'Note\']', 'splendid')
    await page.keyboard.press('Enter')
    await pupExpect(page).toMatchElement('div.rbt-token', { text: 'splendid' })
  })

  it('change language', async () => {
    expect.assertions(7)
    await pupExpect(page).toClick('button#language')
    await pupExpect(page).toMatch('Languages')

    await pupExpect(page).toFill('input.rbt-input-main', 'Navajo')

    // Wait until autosuggest has returned something to click on
    await page.waitForSelector('#rbt-menu-item-0')
    await pupExpect(page).toClick('#rbt-menu-item-0')

    await pupExpect(page).toClick('button', { text: 'Submit' })
    await pupExpect(page).toMatchElement('button#language')
    await pupExpect(page).toMatch('Language: Navajo')
  })

  it('retains changed language after edit', async () => {
    expect.assertions(4)
    await pupExpect(page).toClick('button#editItem')
    await pupExpect(page).toFill('input[placeholder=\'Note\']', 'kinda splendid')
    await page.keyboard.press('Enter')
    await pupExpect(page).toMatchElement('button#language')
    await pupExpect(page).toMatch('Language: Navajo')
  })
})
