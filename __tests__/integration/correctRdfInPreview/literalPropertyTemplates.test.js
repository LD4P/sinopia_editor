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
  describe('repeatable, no default value, default language', () => {
    it('one value', async () => {
      expect.assertions(7)
      await pupExpect(page).toClick('a[href="/editor"]', { text: 'test literal, repeatable, required, no default' })
      await pupExpect(page).toFill('input[placeholder=\'literal, repeatable, required, no default\']', 'first value')
      await page.keyboard.press('Enter')
      await expect(page).toClick('button', { text: 'Preview RDF' })
      const previewRdf = await page.$eval('pre', e => e.textContent)
      expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal1> "first value"@en .')
      expect(previewRdf).toMatch('<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://examples.org/bogusOntologies/Resource> .')
      expect(previewRdf).toMatch('<> <http://www.w3.org/ns/prov#wasGeneratedBy> "Sinopia:RT:Fixture:LiteralRepeatNoDefault" .')
      // ensure we have exactly 3 triples
      const newLinesRegex = (/\n{3}/, 'm')
      expect(previewRdf).toMatch(newLinesRegex)
    })
    it('three values', async () => {
      expect.assertions(11)
      await pupExpect(page).toClick('a[href="/editor"]', { text: 'test literal, repeatable, required, no default' })
      await pupExpect(page).toFill('input[placeholder=\'literal, repeatable, required, no default\']', 'first')
      await page.keyboard.press('Enter')
      await pupExpect(page).toFill('input[placeholder=\'literal, repeatable, required, no default\']', 'second')
      await page.keyboard.press('Enter')
      await pupExpect(page).toFill('input[placeholder=\'literal, repeatable, required, no default\']', 'third')
      await page.keyboard.press('Enter')
      await expect(page).toClick('button', { text: 'Preview RDF' })
      const previewRdf = await page.$eval('pre', e => e.textContent)
      expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal1> "first"@en .')
      expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal1> "second"@en .')
      expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal1> "third"@en .')
      expect(previewRdf).toMatch('<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://examples.org/bogusOntologies/Resource> .')
      expect(previewRdf).toMatch('<> <http://www.w3.org/ns/prov#wasGeneratedBy> "Sinopia:RT:Fixture:LiteralRepeatNoDefault" .')
      // ensure we have exactly 5 triples
      const newLinesRegex = (/\n{5}/, 'm')
      expect(previewRdf).toMatch(newLinesRegex)
    })
  })
  describe('non-repeatable, default value', () => {
    it('defaultLiteral only', async () => {
      expect.assertions(6)
      await pupExpect(page).toClick('a[href="/editor"]', { text: 'test literal, not repeatable, required, default literal only (no URI)' })
      await expect(page).toClick('button', { text: 'Preview RDF' })
      const previewRdf = await page.$eval('pre', e => e.textContent)
      expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal> "mydefaultvalue"@en .')
      expect(previewRdf).toMatch('<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://examples.org/bogusOntologies/Resource> .')
      expect(previewRdf).toMatch('<> <http://www.w3.org/ns/prov#wasGeneratedBy> "Sinopia:RT:Fixture:LiteralNoRepeatDefaultLiteralOnly" .')
      // ensure we have exactly 3 triples
      const newLinesRegex = (/\n{3}/, 'm')
      expect(previewRdf).toMatch(newLinesRegex)
    })
    it.skip('defaultLiteral only, not English', async () => {
      // TODO: not yet supported; see https://github.com/LD4P/sinopia_editor/issues/825
      expect.assertions(6)
      await pupExpect(page).toClick('a[href="/editor"]', { text: 'test literal, not repeatable, required, default literal non-english' })
      await expect(page).toClick('button', { text: 'Preview RDF' })
      const previewRdf = await page.$eval('pre', e => e.textContent)
      expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal> "borkBorkBork .') // need a way to designate this is a specific non-english language
      expect(previewRdf).toMatch('<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://examples.org/bogusOntologies/Resource> .')
      expect(previewRdf).toMatch('<> <http://www.w3.org/ns/prov#wasGeneratedBy> "Sinopia:RT:Fixture:LiteralNoRepeatDefaultNonEnglish" .')
      // ensure we have exactly 3 triples
      const newLinesRegex = (/\n{3}/, 'm')
      expect(previewRdf).toMatch(newLinesRegex)
    })
    it('defaultURI only', async () => {
      expect.assertions(6)
      await pupExpect(page).toClick('a[href="/editor"]', { text: 'test literal, not repeatable, required, default URI only (no literal)' })
      await expect(page).toClick('button', { text: 'Preview RDF' })
      const previewRdf = await page.$eval('pre', e => e.textContent)
      expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal> <http://id.loc.gov/authorities/subjects/sh85027699> .')
      expect(previewRdf).toMatch('<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://examples.org/bogusOntologies/Resource> .')
      expect(previewRdf).toMatch('<> <http://www.w3.org/ns/prov#wasGeneratedBy> "Sinopia:RT:Fixture:LiteralNoRepeatDefaultUriOnly" .')
      // ensure we have exactly 3 triples
      const newLinesRegex = (/\n{3}/, 'm')
      expect(previewRdf).toMatch(newLinesRegex)
    })
    it('defaultURI and defaultLiteral', async () => {
      expect.assertions(6)
      await pupExpect(page).toClick('a[href="/editor"]', { text: 'test literal, not repeatable, required, defaultLiteral and defaultURI' })
      await expect(page).toClick('button', { text: 'Preview RDF' })
      const previewRdf = await page.$eval('pre', e => e.textContent)
      expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal> <http://id.loc.gov/authorities/subjects/sh85027699> .')
      expect(previewRdf).toMatch('<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://examples.org/bogusOntologies/Resource> .')
      expect(previewRdf).toMatch('<> <http://www.w3.org/ns/prov#wasGeneratedBy> "Sinopia:RT:Fixture:LiteralNoRepeatDefaultBoth" .')
      // ensure we have exactly 3 triples
      const newLinesRegex = (/\n{4}/, 'm')
      expect(previewRdf).toMatch(newLinesRegex)
    })
  })
  it.todo('repeatable, single default value, default language') // ditto
  it.todo('repeatable, multiple default values, default language') // ditto
  it.todo('specified non-default language (would we ever need this beyond defaultLiteral)')
})
