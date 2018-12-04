// Copyright 2018 Stanford University see Apache2.txt for license
import expect from 'expect-puppeteer'

describe('Starting Points menu', () => {
  // beforeAll(async () => {
  //   await page.goto('http://127.0.0.1:8080/editor')
  // })

  it('has a starting points div with header and button', async() => {
    // await expect_value_in_sel_textContent('div.StartingPoints > h3', 'Create Resource')
    // await page.waitForSelector('div.StartingPoints > button')
    //   .then(
    //     await expect(page).toClick('button', { text: 'Import Profile'})
    //   ).catch(e => {console.warn(e)})
    //
    // await expect(page).toClick('button', { text: 'Import profile' })
    // await expect(page).toMatchElement('input[type="file"]')
  })
})
//
// async function expect_value_in_sel_textContent(sel, value) {
//   await page.waitForSelector(sel)
//   const sel_text = await page.$eval(sel, e => e.textContent)
//   expect(sel_text).toBe(value)
// }
