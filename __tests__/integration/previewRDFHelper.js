// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'

export async function fillInRequredFieldsForBibframeInstance() {
  await page.setViewport({
    width: 1822,
    height: 961,
  })
  // This will add 1 assertion to each it block's assertion count
  await pupExpect(page).toClick('a', { text: 'BIBFRAME Instance' })
  await page.waitForSelector('a', { text: 'Editor' })

  // Click on one of the property type rows to expand a nested resource
  await page.waitForSelector('div.rOutline-header button.btn-add[data-id=\'title\']')
  await page.click('div.rOutline-header button.btn-add[data-id=\'title\']')

  // Fill in required element
  await page.waitForSelector('button.btn-add[data-id=\'partName\']')
  await page.click('button.btn-add[data-id=\'partName\']')
  await page.waitForSelector('input[placeholder=\'Part name\']')
  await page.type('input[placeholder=\'Part name', 'Hello')
  await page.keyboard.press('Enter')

  // Fill in required element
  await page.waitForSelector('[placeholder=\'Statement of Responsibility Relating to Title Proper (RDA 2.4.2)\'', 'World')
  await page.type('[placeholder=\'Statement of Responsibility Relating to Title Proper (RDA 2.4.2)\'', 'World')
  await page.keyboard.press('Enter')

  // Fill in required element
  await page.type('[placeholder=\'Agent Contribution\']', 'Stanford family')

  // Wait until autosuggest has returned something to click on
  await page.waitForSelector('#rbt-menu-item-1')
  await page.click('#rbt-menu-item-0')
}

export async function incompleteFieldsForBibframeInstance() {
  await page.setViewport({
    width: 1822,
    height: 961,
  })

  // This will add 1 assertion to each it block's assertion count
  await pupExpect(page).toClick('a', { text: 'BIBFRAME Instance' })
}
