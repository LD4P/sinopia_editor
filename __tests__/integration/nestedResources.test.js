// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'

describe('Expanding a resource property in a property panel', () => {
  beforeAll(async () => {
    return await testUserLogin()
  })

  it('loads up the BIBFRAME Instance resource template from the list of loaded templates', async () => {
    expect.assertions(2)
    await pupExpect(page).toClick('a', { text: 'BIBFRAME Instance' })
    await pupExpect(page).toMatch('BIBFRAME Instance')
  })

  it('clicks on the Has BIBFRAME Instance property type rows to expand the resource', async () => {
    expect.assertions(2)
    await pupExpect(page).toClick('a[data-id=\'hasInstance\']')
    await pupExpect(page).toMatchElement('h5', { text: 'BIBFRAME Instance' })
  })

  it('clicks on the Title property to reveal the main title input component', async () => {
    expect.assertions(3)
    await pupExpect(page).toClick('a[data-id=\'title\']')
    await pupExpect(page).toClick('a[data-id=\'mainTitle\']')
    await pupExpect(page).toMatchElement('input[placeholder=\'Preferred Title for Work (RDA 6.2.2, RDA 6.14.2) (BIBFRAME: Main title)\']')
  })

  it('enters a title into the BIBFRAME Instance Work Title component', async () => {
    expect.assertions(3)
    await pupExpect(page).not.toMatchElement('div#userInput', { text: 'An interesting title' })
    await expect(page).toFill('input[placeholder="Preferred Title for Work (RDA 6.2.2, RDA 6.14.2) (BIBFRAME: Main title)"', 'An interesting title')
    await page.keyboard.press('Enter')
    await pupExpect(page).toMatchElement('div#userInput', { text: 'An interesting title' })
  })

  it('clicks on the Responsibility Statement property to reveal the responsibility input component', async () => {
    expect.assertions(2)
    await pupExpect(page).toClick('a[data-id=\'responsibilityStatement\']')
    await pupExpect(page).toMatchElement('input[placeholder=\'Statement of Responsibility Relating to Title Proper (RDA 2.4.2)\']')
  })

  it('enters text into the BIBFRAME Instance Statement of Responsibility component', async () => {
    expect.assertions(3)
    await pupExpect(page).not.toMatchElement('div#userInput', { text: 'A statement of responsibility' })
    await expect(page).toFill('input[placeholder="Statement of Responsibility Relating to Title Proper (RDA 2.4.2)"', 'A statement of responsibility')
    await page.keyboard.press('Enter')
    await pupExpect(page).toMatchElement('div#userInput', { text: 'A statement of responsibility' })
  })

  it('clicks on Contribution property to reveal the input component', async () => {
    expect.assertions(6)
    await pupExpect(page).toClick('a[data-id=\'contribution\']')
    await pupExpect(page).toMatchElement('input[placeholder=\'Agent Contribution\']')
    await expect(page).toFill('input[placeholder=\'Agent Contribution\']', 'Stanford family')
    await pupExpect(page).toMatchElement('ul#lookupComponent')
    await page.waitForSelector('li#rbt-menu-item-0')
    await pupExpect(page).toMatchElement('li#rbt-menu-item-0')
    await pupExpect(page).toClick('li#rbt-menu-item-0')
  })

  it('it clicks on Preview RDF and verifies the text', async () => {
    expect.assertions(4)
    await pupExpect(page).toClick('button', { text: 'Preview RDF' })
    const rdfOut = await page.$eval('pre', e => e.textContent) // Copy the text from the modal into a variable
    await expect(rdfOut).toMatch('An interesting title')
    await expect(rdfOut).toMatch('A statement of responsibility')
    await expect(rdfOut).toMatch('http://id.loc.gov/authorities/subjects/sh85127327') // this is the Stanford family URI
  })
})
