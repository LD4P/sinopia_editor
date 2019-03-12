// Copyright 2018 Stanford University see Apache2.txt for license
import pupExpect from 'expect-puppeteer'

describe('Editor', () => {
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:8080/#id_token=eyJraWQiOiJZa1ZFamRXUldveVU3alZlWVlvSzNmRzJpOFhDbTRUbFFFUEpsNFBRWEZJPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiWjNvUlVua09FU3Jpd05LNHBpR19OdyIsInN1YiI6IjNiOTQ0ODQxLTY2NzEtNDIzYi04NjIyLWVmNTVhMjhlMWRlMyIsImF1ZCI6IjU0M2Nhdjk1dTBxMXJxY2FnczFuZWRjNjhhIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiNWE1MTc5YjUtNDUwNi0xMWU5LWI2MzQtYjdlNjk0NzdhNDhkIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1NTI0MjI5MjAsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yX0hVbU5JZG1oeSIsImNvZ25pdG86dXNlcm5hbWUiOiJjaS1lZGl0b3ItdXNlciIsImV4cCI6MTU1MjQyNjUyMCwiaWF0IjoxNTUyNDIyOTIwLCJlbWFpbCI6ImpncmViZW5Ac3RhbmZvcmQuZWR1In0.etfYjc2CSeWOFey9npSpV_dgSQw6ufjaQmEf2lOZ4bzwTYPQ6IFLoetUKPaPQ5jUQWbZwkXA-SV5BsM-t0GRHO6z3VJNLZxwExP1nAJKV-mneWieqBJCr6YBlD-wD-Dn-G3v5uEtx5Ha-ZexfY4YDBMSuUd9uiJhwjiuxAIrp66ZahiW0MuaUNdStRd1X2JGJ2q4TQTLDvVQ0lnuMk6yfD5RDG2oujldJuSMWOJXuMK9DCA-H_xerWYDLEdfa0H8xKOpIsRcx6aIKfOsuv9v57bWonAe11La3UZGyaGf2QyXzMhdEyJSfKynauCfauOtWkvyYx7BuiP8r0v5sFY5EQ&access_token=eyJraWQiOiJBaHRJUGtMcUdaR0pFUTkyNmNQckJVdXdqQTZXVTZDNVB2TWJVb0pKQUNvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIzYjk0NDg0MS02NjcxLTQyM2ItODYyMi1lZjU1YTI4ZTFkZTMiLCJldmVudF9pZCI6IjVhNTE3OWI1LTQ1MDYtMTFlOS1iNjM0LWI3ZTY5NDc3YTQ4ZCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoib3BlbmlkIGVtYWlsIiwiYXV0aF90aW1lIjoxNTUyNDIyOTIwLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9IVW1OSWRtaHkiLCJleHAiOjE1NTI0MjY1MjAsImlhdCI6MTU1MjQyMjkyMCwidmVyc2lvbiI6MiwianRpIjoiYmE2OWRmMjctOTMzYi00YmM2LTkwYzMtMTJhOWQyNjMxODljIiwiY2xpZW50X2lkIjoiNTQzY2F2OTV1MHExcnFjYWdzMW5lZGM2OGEiLCJ1c2VybmFtZSI6ImNpLWVkaXRvci11c2VyIn0.DGcawIURydWlaENsKHLFaENdrX8706so4b0ISFvy1_KeIBGA6y4lDPQVktXQpQTsZRpgTBOs6N3i7lZjE2SquKTzwkOQ0LyRmwxOwJ2YByNqrQO4-vhs7PHGi6rd_HLBphasjGXfWL_kyzyguWVv2o800AJleK5WXeIkKCFSb0ECyTa6FfsbtIqc-Bc71RroB1gxUg71hDt9XnG8mlkWMYPPFKt06WNQZPnUFwn2A1vP7zOCHYpVN850k7--MWvDWDMCWbTDcq_auj3DdvDEIRZ8-vulCd_VWig89TekEGhcZ4ra8JBN02U1LdB5ZyGIBIPdDvrufge52kqn7uW6Cg&expires_in=3600&token_type=Bearer')
    await page.goto('http://127.0.0.1:8080/import')
    await page.waitForSelector('button#ImportProfile')
    await page.goto('http://127.0.0.1:8080/editor') // TODO: remove this when import affects editor and redirects to it on success
  })

  describe('importing a profile/template', () => {
    beforeAll(async() => {
      await page.click('button#ImportProfile')
      await pupExpect(page).toMatch('select a file to upload:')
    })

    // TODO: show ajv.validate was called
    //   can't easily show because puppeteer is between this test and jest mocks
    // it('runs validation', () => {
    // })

    // TODO: show it only fetches and loads any individual schema once

    describe('schema valid', () => {
      describe('schema url in JSON', () => {
        it('displays resource template passing validation', async () => {
          pupExpect(page).not.toMatch('LC Classification Number')
          const fileInput = await page.$('.DropZone input[type="file"]')
          await fileInput.uploadFile("__tests__/__fixtures__/lcc_v0.1.0.json")
          await pupExpect(page).toMatch('LC Classification Number')
        })

        it('displays profile passing validation', async () => {
          pupExpect(page).not.toMatch('Place Associated with a Work')
          const fileInput = await page.$('.DropZone input[type="file"]')
          await fileInput.uploadFile("__tests__/__fixtures__/place_profile_v0.1.0.json")
          await pupExpect(page).toMatch('Place Associated with a Work')
        })
      })
      describe('schema url not in JSON - v0.0.2 schemas used', () => {
        it('displays resource template passing validation', async () => {
          pupExpect(page).not.toMatch('LC Classification Number')
          const fileInput = await page.$('.DropZone input[type="file"]')
          const dialog = await pupExpect(page).toDisplayDialog(async () => {
            await fileInput.uploadFile("__tests__/__fixtures__/lcc_v0.0.2.json")
          })
          const exp_msg = "No schema url found in template. Using https://ld4p.github.io/sinopia/schemas/0.0.1/resource-template.json"
          await expect(dialog.message()).toMatch(exp_msg)
          await dialog.dismiss()
          await pupExpect(page).toMatch('LC Classification Number')
        })
        it('displays profile passing validation', async () => {
          pupExpect(page).not.toMatch('Place Associated with a Work')
          const fileInput = await page.$('.DropZone input[type="file"]')
          const dialog = await pupExpect(page).toDisplayDialog(async () => {
            await fileInput.uploadFile("__tests__/__fixtures__/place_profile_v0.0.2.json")
          })
          const exp_msg = "No schema url found in template. Using https://ld4p.github.io/sinopia/schemas/0.0.1/profile.json"
          await expect(dialog.message()).toMatch(exp_msg)
          await dialog.dismiss()
          await pupExpect(page).toMatch('Place Associated with a Work')
        })
      })
    })

    describe('not schema valid', () => {
      let dialog
      beforeAll(async() => {
        const fileInput = await page.$('.DropZone input[type="file"]')
        dialog = await pupExpect(page).toDisplayDialog(() => {
          fileInput.uploadFile("__tests__/__fixtures__/lcc_v0.1.0_invalid.json")
        })
      })

      it('displays dialog', async () => {
        const exp_msg = "ERROR - CANNOT USE PROFILE/RESOURCE TEMPLATE: problem validating template: Error: [ { keyword: 'required'"
        await expect(dialog.message()).toMatch(exp_msg)
      })
      it('does not populate form from loaded file', async () => {
        await dialog.dismiss()
        await pupExpect(page).not.toMatch('Invalid Resource Template')
      })
    })

    describe('unfindable schema', () => {
      let dialog
      beforeAll(async() => {
        const fileInput = await page.$('.DropZone input[type="file"]')
        dialog = await pupExpect(page).toDisplayDialog(async () => {
          await fileInput.uploadFile("__tests__/__fixtures__/edition_bad_schema.json")
        })
      })
      it('displays dialog', async () => {
        const exp_msg = "ERROR - CANNOT USE PROFILE/RESOURCE TEMPLATE: problem validating template: Error: error getting json schemas TypeError: Cannot read property '1' of null"
        await expect(dialog.message()).toMatch(exp_msg)
      })
      it('does not populate form from loaded file', async () => {
        await dialog.dismiss()
        await pupExpect(page).not.toMatch('Edition Bad Schema')
      })
    })

    describe('bad JSON', async () => {
      let dialog
      beforeAll(async() => {
        const fileInput = await page.$('.DropZone input[type="file"]')
        dialog = await pupExpect(page).toDisplayDialog(async () => {
          await fileInput.uploadFile("__tests__/__fixtures__/ddc_bad_json.json")
        })
      })
      it('displays dialog', async () => {
        const exp_msg = "ERROR - CANNOT USE PROFILE/RESOURCE TEMPLATE: problem parsing JSON template: SyntaxError: Unexpected token } in JSON at position"
        await expect(dialog.message()).toMatch(exp_msg)
      })
      it('does not populate form from loaded file', async () => {
        await dialog.dismiss()
        await pupExpect(page).not.toMatch('DDC Bad JSON')
      })
    })
  })
})
