// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from '../loginHelper'

/*
 * note that this is NOT testing the RDF saved in the server
 *  it checks the RDF before we send it to the server
 */
describe('RDF from literal property templates', () => {
  beforeAll(async () => {
    return await testUserLogin()
  })

  beforeEach(async () => {
    await page.goto('http://127.0.0.1:8888/templates')
    return await page.waitForSelector('.react-bootstrap-table')
  })

  it('non-repeatable, no default value, default language', async () => {
    expect.assertions(7)
    await pupExpect(page).toClick('a[href="/editor"]', { text: 'test literal, not repeatable, required, no default' })
    await pupExpect(page).toFill('input[placeholder=\'literal, not repeatable, required, no default\']', 'splendid')
    await page.keyboard.press('Enter')
    await expect(page).toClick('button', { text: 'Preview RDF' })
    const previewRdf = await page.$eval('pre', e => e.textContent)
    expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal1> "splendid"@en .')
    expect(previewRdf).toMatch('<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://examples.org/bogusOntologies/Resource> .')
    expect(previewRdf).toMatch('<> <http://www.w3.org/ns/prov#wasGeneratedBy> "Sinopia:RT:Fixture:LiteralNoRepeatNoDefault" .')
    // ensure we have exactly 3 triples
    const newLinesRegex = (/\n{3}/, 'm')
    expect(previewRdf).toMatch(newLinesRegex)
  })
  it.todo('repeatable, no default value, default language')
  it.todo('non-repeatable, default value, default language') // defaultLiteral only?  defaultURI???
  it.todo('repeatable, single default value, default language') // ditto
  it.todo('repeatable, multiple default values, default language') // ditto
  it.todo('specified non-default language') // for each of the above???
})
