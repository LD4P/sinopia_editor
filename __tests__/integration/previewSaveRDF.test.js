// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'

describe('Previewing the RDF', () => {
  beforeAll(async () => {
    return await testUserLogin()
  })

  beforeEach(async () => {
    await pupExpect(page).toClick('a', { text: 'BIBFRAME Instance' })
    // await pupExpect(page).toMatch('BIBFRAME Instance')
    await page.waitForSelector('a[data-id=\'title\'')
    await page.click('a[data-id=\'title\']')
    await page.waitForSelector('a[data-id=\'mainTitle\']')
    await page.click('a[data-id=\'mainTitle\']')
    await page.type('[placeholder=\'Preferred Title for Work (RDA 6.2.2, RDA 6.14.2) (BIBFRAME: Main title)\']', 'Hello')
    await page.keyboard.press('Enter')
    await page.type('[placeholder=\'Statement of Responsibility Relating to Title Proper (RDA 2.4.2)\'', 'World')
    await page.keyboard.press('Enter')
    await page.type('[placeholder=\'Agent Contribution\']', 'Stanford family')
    // wait until autosuggest has returned something to click on
    await page.waitForSelector('#rbt-menu-item-0')
    await page.click('#rbt-menu-item-0')
  })

  it('builds the rdf and has dialog for saving', async () => {
    expect.assertions(13) // Includes one assertion from setup

    // Click on the PreviewRDF button and a modal appears
    await pupExpect(page).toClick('button', { text: 'Preview RDF' })
    await pupExpect(page).toMatch('RDF Preview')
    await pupExpect(page).toMatch('If this looks good, then click Save and Publish')

    // Present a choice of group to save to from the RDFModal
    await page.waitForSelector('#modal-save')
    await pupExpect(page).toClick('#modal-save', { text: 'Save & Publish' })
    await page.waitForSelector('.modal-title')
    await page.screenshot({ path: '1.png', fullPage: true })
    await pupExpect(page).toMatch('Which group do you want to save to?') // Add class modal-title
    await pupExpect(page).toMatch('Which group do you want to associate this record to?')

    // Click on the select menu to choose a group
    await page.select('.group-select-options select', 'stanford')
    await pupExpect(page).toClick('button', { text: 'Save' })

    // Presents a choice of group to save to when the non-modal Save and Publish is clicked
    await pupExpect(page).toClick('button', { text: 'Save & Publish' })
    await pupExpect(page).toMatch('Which group do you want to save to?')
    await pupExpect(page).toMatch('Which group do you want to associate this record to?')

    // Subsequent updates don't pop up the group modal
    await pupExpect(page).toClick('button', { text: 'Save & Publish' })
    await pupExpect(page).not.toMatch('Which group do you want to save to?')  
  })

//   describe('Hold this test', () => {
//   // it('clicks on the Has BIBFRAME Instance property type rows to expand the resource', async () => {
//   //   expect.assertions(2)
//   //   await pupExpect(page).toClick('a[data-id=\'hasInstance\']')
//   //   await pupExpect(page).toMatchElement('h5', { text: 'BIBFRAME Instance' })
//   // })

//   // it('clicks on the Title property to reveal the main title input component', async () => {
//   //   expect.assertions(3)
//   //   await pupExpect(page).toClick('a[data-id=\'title\']')
//   //   await pupExpect(page).toClick('a[data-id=\'mainTitle\']')
//   //   await pupExpect(page).toMatchElement('input[placeholder=\'Preferred Title for Work (RDA 6.2.2, RDA 6.14.2) (BIBFRAME: Main title)\']')
//   // })

//   // Asserting that the value entered above is now visible
//   it('enters a title into the BIBFRAME Instance Work Title component', async () => {
//     expect.assertions(2) // Includes an assertion from beforeEach
//     await pupExpect(page).toMatchElement('div#userInput', { text: 'Hello' })
//   })

//   // it('clicks on the Responsibility Statement property to reveal the responsibility input component', async () => {
//   //   expect.assertions(2)
//   //   await pupExpect(page).toClick('a[data-id=\'responsibilityStatement\']')
//   //   await pupExpect(page).toMatchElement('input[placeholder=\'Statement of Responsibility Relating to Title Proper (RDA 2.4.2)\']')
//   // })

//   it('enters text into the BIBFRAME Instance Statement of Responsibility component', async () => {
//     expect.assertions(2) // Includes an assertion from beforeEach
//     await pupExpect(page).toMatchElement('div#userInput', { text: 'World' })
//   })

//   it('clicks on Contribution property to reveal the input component', async () => {
//     expect.assertions(6)
//     await pupExpect(page).toClick('a[data-id=\'contribution\']')
//     await pupExpect(page).toMatchElement('input[placeholder=\'Agent Contribution\']')
//     await expect(page).toFill('input[placeholder=\'Agent Contribution\']', 'Stanford family')
//     await pupExpect(page).toMatchElement('ul#lookupComponent')
//     await page.waitForSelector('li#rbt-menu-item-0')
//     await pupExpect(page).toMatchElement('li#rbt-menu-item-0')
//     await pupExpect(page).toClick('li#rbt-menu-item-0')
//   })

//   it('it clicks on Preview RDF and verifies the text', async () => {
//     expect.assertions(3)
//     await pupExpect(page).toClick('button', { text: 'Preview RDF' })
//     const rdfOut = await page.$eval('pre', e => e.textContent) // Copy the text from the modal into a variable
//     await expect(rdfOut).toMatch(/Hello/)
//     await expect(rdfOut).toMatch(/World/)
//     await expect(rdfOut).toMatch(/http:\/\/id.loc.gov\/authorities\/subjects\/sh85127327/) // this is the Stanford family URI
//   })
// })
})
