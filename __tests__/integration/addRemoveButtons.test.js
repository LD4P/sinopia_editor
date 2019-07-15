// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from './loginHelper'
import nodesWithTextCount from './integrationHelper'

describe('Adding and removing resources', () => {
  beforeAll(async () => {
    await testUserLogin()
  })

  it('loads up a resource template from the list of loaded templates', async () => {
    expect.assertions(2)
    await pupExpect(page).toClick('a', { text: 'BIBFRAME Instance' })
    await pupExpect(page).toMatch('BIBFRAME Instance')
  })

  it('clicks on add button for a resource property', async () => {
    expect.assertions(3)
    expect(await nodesWithTextCount('h4', 'BIBFRAME Work', page)).toEqual(1)

    await pupExpect(page).toClick('button', { text: 'Add' })
    expect(await nodesWithTextCount('h4', 'BIBFRAME Work', page)).toEqual(2)
  })

  it('clicks on remove button for a resource property', async () => {
    expect.assertions(3)
    expect(await nodesWithTextCount('h4', 'BIBFRAME Work', page)).toEqual(2)

    await pupExpect(page).toClick('button', { text: 'Remove' })
    expect(await nodesWithTextCount('h4', 'BIBFRAME Work', page)).toEqual(1)
  })

  it('clicks on add button for a nested resource property', async () => {
    expect.assertions(4)
    await pupExpect(page).toClick('button[data-id=\'hasInstance\']')
    expect(await nodesWithTextCount('h5', 'BIBFRAME Instance', page)).toEqual(1)

    await pupExpect(page).toClick('div.rOutline-property button.btn-add')
    expect(await nodesWithTextCount('h5', 'BIBFRAME Instance', page)).toEqual(2)
  })

  it('clicks on remove button for a nested resource property', async () => {
    expect.assertions(3)
    expect(await nodesWithTextCount('h5', 'BIBFRAME Instance', page)).toEqual(2)

    await pupExpect(page).toClick('div.rOutline-property button.btn-remove')
    expect(await nodesWithTextCount('h5', 'BIBFRAME Instance', page)).toEqual(1)
  })
})
