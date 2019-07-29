// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'

describe('Expanding a resource property in a property panel', () => {
  beforeAll(async () => {
    await testUserLogin()
  })

  it('loads up a resource template from the list of loaded templates', async () => {
    expect.assertions(3)
    await pupExpect(page).toClick('a', { text: 'BIBFRAME Instance' })
    await pupExpect(page).toMatch('Editor')
    await pupExpect(page).toMatch('BIBFRAME Instance')
  })

  it('clicks on one of the property type rows to expand a nested resource', async () => {
    expect.assertions(3)
    await pupExpect(page).toMatchElement('button.btn-add[data-id=\'hasInstance\']')
    await pupExpect(page).toClick('button.btn-add[data-id=\'hasInstance\']')
    await pupExpect(page).toMatchElement('h5', { text: 'BIBFRAME Instance' })
  })

  it('nested property with default is already expanded', async () => {
    expect.assertions(1)
    await pupExpect(page).toMatchElement('input[placeholder=\'Holdings\']')
  })

  it('nested property clicks on a nested property to reveal an input component', async () => {
    expect.assertions(2)
    await pupExpect(page).toClick('button.btn-add[data-id=\'frequency\']')
    await pupExpect(page).toMatchElement('input[placeholder=\'Frequency (RDA 2.14)\']')
  })

  it('enters a value into a nested property component', async () => {
    expect.assertions(3)
    await pupExpect(page).not.toMatchElement('div#userInput', { text: 'Some text' })
    await expect(page).toFill('input[placeholder="Holdings"', 'Some text')
    await page.keyboard.press('Enter')
    await pupExpect(page).toMatchElement('div', { text: 'Some text' })
  })

  it('enters a non-roman value into a nested property component', async () => {
    expect.assertions(3)
    await pupExpect(page).toMatchElement('input[placeholder="Holdings"')
    await pupExpect(page).toFill('input[placeholder="Holdings"', '甲骨文')
    await page.keyboard.press('Enter')
    await pupExpect(page).toMatchElement('div', { text: '甲骨文' })
  })
})
