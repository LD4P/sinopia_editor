// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'

export async function fillInRequredFieldsForBibframeInstance() {
  // This will add 1 assertion to each it block's assertion count
  await pupExpect(page).toClick('a', { text: 'BIBFRAME Instance' })

  // Click on one of the property type rows to expand a nested resource
  await page.waitForSelector('button[data-id=\'title\']')
  await page.click('button[data-id=\'title\']')
  await page.waitForSelector('button[data-id=\'mainTitle\']')

  // Fill in required element
  await page.click('button[data-id=\'mainTitle\']')
  await page.type('[placeholder=\'Preferred Title for Work (RDA 6.2.2, RDA 6.14.2) (BIBFRAME: Main title)\']', 'Hello')
  await page.keyboard.press('Enter')

  // Fill in required element
  await page.type('[placeholder=\'Statement of Responsibility Relating to Title Proper (RDA 2.4.2)\'', 'World')
  await page.keyboard.press('Enter')

  // Fill in required element
  await page.type('[placeholder=\'Agent Contribution\']', 'Stanford family')

  // Wait until autosuggest has returned something to click on
  await page.waitForSelector('#rbt-menu-item-0')
  await page.click('#rbt-menu-item-0')
}

export async function incompleteFieldsForBibframeInstance() {
  // This will add 1 assertion to each it block's assertion count
  await pupExpect(page).toClick('a', { text: 'BIBFRAME Instance' })
}
