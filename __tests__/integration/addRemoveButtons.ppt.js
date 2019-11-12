// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'
import nodesWithTextCount from './integrationHelper'

describe('Adding and removing resources', () => {
  beforeAll(async () => {
    await testUserLogin()
  })

  it('loads up a resource template from the list of loaded templates', async () => {
    expect.assertions(3)
    await pupExpect(page).toClick('a', { text: 'BIBFRAME Instance' })
    await pupExpect(page).toMatch('Editor')
    await pupExpect(page).toMatch('BIBFRAME Instance')
  })

  it('clicks on add button for a resource property', async () => {
    expect.assertions(3)
    expect(await nodesWithTextCount('h4', 'BIBFRAME Work', page)).toEqual(1)

    await pupExpect(page).toClick('button.btn-add-another', { text: 'Add' })
    expect(await nodesWithTextCount('h4', 'BIBFRAME Work', page)).toEqual(2)
  })

  it('clicks on remove button for a resource property', async () => {
    expect.assertions(3)
    expect(await nodesWithTextCount('h4', 'BIBFRAME Work', page)).toEqual(2)

    await pupExpect(page).toClick('button.btn-remove-another')
    expect(await nodesWithTextCount('h4', 'BIBFRAME Work', page)).toEqual(1)
  })

  it('clicks on add button for a nested resource property', async () => {
    expect.assertions(4)
    await pupExpect(page).toClick('button.btn-add[data-id=\'hasInstance\']')
    expect(await nodesWithTextCount('h5', 'BIBFRAME Instance', page)).toEqual(1)

    await pupExpect(page).toClick('div.rOutline-property button.btn-add-another')
    expect(await nodesWithTextCount('h5', 'BIBFRAME Instance', page)).toEqual(2)
  })

  it('clicks on remove button for a nested resource property', async () => {
    expect.assertions(3)
    expect(await nodesWithTextCount('h5', 'BIBFRAME Instance', page)).toEqual(2)

    await pupExpect(page).toClick('div.rOutline-property button.btn-remove-another')
    expect(await nodesWithTextCount('h5', 'BIBFRAME Instance', page)).toEqual(1)
  })
})
