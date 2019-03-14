// Copyright 2018 Stanford University see Apache2.txt for license
import pupExpect from 'expect-puppeteer'
import Config from '../../src/Config'

describe('Editor', () => {
  beforeAll(async () => {
    jest.setTimeout(15000);
    await page.goto(`http://127.0.0.1:8888/${Config.awsCognitoJWTHashForTest}`)
  })

  describe('importing a profile/template', () => {
    // TODO: show ajv.validate was called
    //   can't easily show because puppeteer is between this test and jest mocks
    // it('runs validation', () => {
    // })

    // TODO: show it only fetches and loads any individual schema once

    describe('schema valid', () => {
      beforeEach(async () => {
        await page.goto('http://127.0.0.1:8888/import')
      })

      describe('schema url in JSON', () => {
        it('displays resource template passing validation', async () => {
          pupExpect(page).not.toMatch('LC Classification Number')

          await page.waitForSelector('button#ImportProfile')
          await page.click('button#ImportProfile')
          await pupExpect(page).toMatch('select a file to upload:')

          const fileInput = await page.$('.DropZone input[type="file"]')
          // await fileInput.uploadFile("__tests__/__fixtures__/lcc_v0.1.0.json")
          // await pupExpect(page).toMatch('LC Classification Number')
        })

        it('displays profile passing validation', async () => {
          pupExpect(page).not.toMatch('Place Associated with a Work')

          await page.waitForSelector('button#ImportProfile')
          await page.click('button#ImportProfile')
          await pupExpect(page).toMatch('select a file to upload:')

          const fileInput = await page.$('.DropZone input[type="file"]')
          // await fileInput.uploadFile("__tests__/__fixtures__/place_profile_v0.1.0.json")
          // await pupExpect(page).toMatch('Place Associated with a Work')
        })
      })
      describe('schema url not in JSON - v0.0.2 schemas used', () => {
        it('displays resource template passing validation', async () => {
          pupExpect(page).not.toMatch('LC Classification Number')

          await page.waitForSelector('button#ImportProfile')
          await page.click('button#ImportProfile')
          await pupExpect(page).toMatch('select a file to upload:')

          const fileInput = await page.$('.DropZone input[type="file"]')
          // const dialog = await pupExpect(page).toDisplayDialog(async () => {
          //   await fileInput.uploadFile("__tests__/__fixtures__/lcc_v0.0.2.json")
          // })
          const exp_msg = "No schema url found in template. Using https://ld4p.github.io/sinopia/schemas/0.0.1/resource-template.json"
          // await expect(dialog.message()).toMatch(exp_msg)
          // await dialog.dismiss()
          // await pupExpect(page).toMatch('LC Classification Number')
        })
        it('displays profile passing validation', async () => {
          pupExpect(page).not.toMatch('Place Associated with a Work')

          await page.waitForSelector('button#ImportProfile')
          await page.click('button#ImportProfile')
          await pupExpect(page).toMatch('select a file to upload:')

          const fileInput = await page.$('.DropZone input[type="file"]')
          // const dialog = await pupExpect(page).toDisplayDialog(async () => {
          //   await fileInput.uploadFile("__tests__/__fixtures__/place_profile_v0.0.2.json")
          // })
          const exp_msg = "No schema url found in template. Using https://ld4p.github.io/sinopia/schemas/0.0.1/profile.json"
          // await expect(dialog.message()).toMatch(exp_msg)
          // await dialog.dismiss()
          // await pupExpect(page).toMatch('Place Associated with a Work')
        })
      })
    })

    describe('not schema valid', () => {
      let dialog
      beforeAll(async() => {
        await page.goto('http://127.0.0.1:8888/import')
        await page.waitForSelector('button#ImportProfile')
        await page.click('button#ImportProfile')
        await pupExpect(page).toMatch('select a file to upload:')

        const fileInput = await page.$('.DropZone input[type="file"]')
        // dialog = await pupExpect(page).toDisplayDialog(() => {
        //   fileInput.uploadFile("__tests__/__fixtures__/lcc_v0.1.0_invalid.json")
        // })
      })

      it('displays dialog', async () => {
        const exp_msg = "ERROR - CANNOT USE PROFILE/RESOURCE TEMPLATE: problem validating template: Error: [ { keyword: 'required'"
        // await expect(dialog.message()).toMatch(exp_msg)
      })
      it('does not populate form from loaded file', async () => {
        // await dialog.dismiss()
        await pupExpect(page).not.toMatch('Invalid Resource Template')
      })
    })

    describe('unfindable schema', () => {
      let dialog
      beforeAll(async() => {
        const fileInput = await page.$('.DropZone input[type="file"]')
        // dialog = await pupExpect(page).toDisplayDialog(async () => {
        //   await fileInput.uploadFile("__tests__/__fixtures__/edition_bad_schema.json")
        // })
      })
      it('displays dialog', async () => {
        const exp_msg = "ERROR - CANNOT USE PROFILE/RESOURCE TEMPLATE: problem validating template: Error: error getting json schemas TypeError: Cannot read property '1' of null"
        // await expect(dialog.message()).toMatch(exp_msg)
      })
      it('does not populate form from loaded file', async () => {
        // await dialog.dismiss()
        await pupExpect(page).not.toMatch('Edition Bad Schema')
      })
    })

    describe('bad JSON', async () => {
      let dialog
      beforeAll(async() => {
        const fileInput = await page.$('.DropZone input[type="file"]')
        // dialog = await pupExpect(page).toDisplayDialog(async () => {
        //   await fileInput.uploadFile("__tests__/__fixtures__/ddc_bad_json.json")
        // })
      })
      it('displays dialog', async () => {
        const exp_msg = "ERROR - CANNOT USE PROFILE/RESOURCE TEMPLATE: problem parsing JSON template: SyntaxError: Unexpected token } in JSON at position"
        // await expect(dialog.message()).toMatch(exp_msg)
      })
      it('does not populate form from loaded file', async () => {
        // await dialog.dismiss()
        await pupExpect(page).not.toMatch('DDC Bad JSON')
      })
    })
  })
})
