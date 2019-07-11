// Copyright 2019 Stanford University see LICENSE for license

import pupExpect from 'expect-puppeteer'
import { testUserLogin } from '../loginHelper'

/*
 * note that this is NOT testing the RDF saved in the server
 *  it checks the RDF before we send it to the server
 */
describe('RDF from literal property templates', () => {
  beforeAll(async () => {
    await testUserLogin()
  })

  beforeEach(async () => {
    await page.goto('http://127.0.0.1:8888/templates')
    await page.waitForSelector('.react-bootstrap-table')
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
    expect(numLines(previewRdf)).toEqual(3)
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
      expect(numLines(previewRdf)).toEqual(3)
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
      expect(numLines(previewRdf)).toEqual(5)
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
      expect(numLines(previewRdf)).toEqual(3)
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
      expect(numLines(previewRdf)).toEqual(3)
    })
  })

  describe('repeatable, default value(s)', () => {
    describe('one value', () => {
      it('defaultLiteral only', async () => {
        expect.assertions(6)
        await pupExpect(page).toClick('a[href="/editor"]', { text: 'test literal, repeatable, required, default literal only (no URI)' })
        await expect(page).toClick('button', { text: 'Preview RDF' })
        const previewRdf = await page.$eval('pre', e => e.textContent)
        expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal> "mydefaultvalue"@en .')
        expect(previewRdf).toMatch('<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://examples.org/bogusOntologies/Resource> .')
        expect(previewRdf).toMatch('<> <http://www.w3.org/ns/prov#wasGeneratedBy> "Sinopia:RT:Fixture:LiteralRepeatDefaultLiteralOnly" .')
        expect(numLines(previewRdf)).toEqual(3)
      })
      it.skip('defaultLiteral only, not English', async () => {
        // TODO: not yet supported; see https://github.com/LD4P/sinopia_editor/issues/825
        expect.assertions(6)
        await pupExpect(page).toClick('a[href="/editor"]', { text: 'test literal, repeatable, required, default literal non-english' })
        await expect(page).toClick('button', { text: 'Preview RDF' })
        const previewRdf = await page.$eval('pre', e => e.textContent)
        expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal> "borkBorkBork .') // need a way to designate this is a specific non-english language
        expect(previewRdf).toMatch('<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://examples.org/bogusOntologies/Resource> .')
        expect(previewRdf).toMatch('<> <http://www.w3.org/ns/prov#wasGeneratedBy> "Sinopia:RT:Fixture:LiteralRepeatDefaultNonEnglish" .')
        expect(numLines(previewRdf)).toEqual(3)
      })
    })
    describe('three values, 1 default', () => {
      it('defaultLiteral only', async () => {
        expect.assertions(10)
        await pupExpect(page).toClick('a[href="/editor"]', { text: 'test literal, repeatable, required, default literal only (no URI)' })
        await pupExpect(page).toFill('input[placeholder=\'literal, repeatable, required, default literal only, default language\']', 'another')
        await page.keyboard.press('Enter')
        await pupExpect(page).toFill('input[placeholder=\'literal, repeatable, required, default literal only, default language\']', 'yet another')
        await page.keyboard.press('Enter')
        await expect(page).toClick('button', { text: 'Preview RDF' })
        const previewRdf = await page.$eval('pre', e => e.textContent)
        expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal> "mydefaultvalue"@en .')
        expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal> "another"@en .')
        expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal> "yet another"@en .')
        expect(previewRdf).toMatch('<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://examples.org/bogusOntologies/Resource> .')
        expect(previewRdf).toMatch('<> <http://www.w3.org/ns/prov#wasGeneratedBy> "Sinopia:RT:Fixture:LiteralRepeatDefaultLiteralOnly" .')
        expect(numLines(previewRdf)).toEqual(5)
      })
      it.skip('defaultLiteral only, not English', async () => {
        // TODO: not yet supported; see https://github.com/LD4P/sinopia_editor/issues/825
        expect.assertions(10)
        await pupExpect(page).toClick('a[href="/editor"]', { text: 'test literal, repeatable, required, default literal non-english' })
        await pupExpect(page).toFill('input[placeholder=\'literal, repeatable, required, default literal non-english\']', 'another')
        await page.keyboard.press('Enter')
        await pupExpect(page).toFill('input[placeholder=\'literal, repeatable, required, default literal non-english\']', 'yet another')
        await page.keyboard.press('Enter')
        await expect(page).toClick('button', { text: 'Preview RDF' })
        const previewRdf = await page.$eval('pre', e => e.textContent)
        expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal> "borkBorkBork .') // need a way to designate this is a specific non-english language
        expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal> "another"@en .')
        expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal> "yet another"@en .')
        expect(previewRdf).toMatch('<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://examples.org/bogusOntologies/Resource> .')
        expect(previewRdf).toMatch('<> <http://www.w3.org/ns/prov#wasGeneratedBy> "Sinopia:RT:Fixture:LiteralRepeatDefaultNonEnglish" .')
        expect(numLines(previewRdf)).toEqual(5)
      })
    })

    describe('three values, 2 defaults', () => {
      it('defaultLiteral only', async () => {
        expect.assertions(9)
        await pupExpect(page).toClick('a[href="/editor"]', { text: 'test literal, repeatable, required, two defaults literal only (no URI)' })
        await pupExpect(page).toFill('input[placeholder=\'literal, repeatable, required, two defaults literal only, default language\']', 'another')
        await page.keyboard.press('Enter')
        await expect(page).toClick('button', { text: 'Preview RDF' })
        const previewRdf = await page.$eval('pre', e => e.textContent)
        expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal> "mydefaultvalue"@en .')
        expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal> "myotherdefaultvalue"@en .')
        expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal> "another"@en .')
        expect(previewRdf).toMatch('<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://examples.org/bogusOntologies/Resource> .')
        expect(previewRdf).toMatch('<> <http://www.w3.org/ns/prov#wasGeneratedBy> "Sinopia:RT:Fixture:LiteralRepeat2DefaultsLiteralOnly" .')
        expect(numLines(previewRdf)).toEqual(5)
      })
      it.skip('defaultLiteral only, not English', async () => {
        // TODO: not yet supported; see https://github.com/LD4P/sinopia_editor/issues/825
        expect.assertions(9)
        await pupExpect(page).toClick('a[href="/editor"]', { text: 'test literal, repeatable, required, two defaults literal non-english' })
        await pupExpect(page).toFill('input[placeholder=\'literal, repeatable, required, two defaults literal non-english\']', 'another')
        await page.keyboard.press('Enter')
        await expect(page).toClick('button', { text: 'Preview RDF' })
        const previewRdf = await page.$eval('pre', e => e.textContent)
        expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal> "borkBorkBork .') // need a way to designate this is a specific non-english language
        expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal> "und dann der Maestro sagte ..." .')
        expect(previewRdf).toMatch('<> <http://examples.org/bogusOntologies/literal> "another"@en .')
        expect(previewRdf).toMatch('<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://examples.org/bogusOntologies/Resource> .')
        expect(previewRdf).toMatch('<> <http://www.w3.org/ns/prov#wasGeneratedBy> "Sinopia:RT:Fixture:LiteralRepeat2DefaultsNonEnglish" .')
        expect(numLines(previewRdf)).toEqual(5)
      })
    })
  })
})

function numLines(str) {
  const lines = str.split('\n')
  const nonEmptyLines = lines.filter(Boolean)
  return nonEmptyLines.length
}
