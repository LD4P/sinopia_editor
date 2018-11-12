/**
Copyright 2018 The Board of Trustees of the Leland Stanford Junior University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/
describe('Editor Tab', () => {
//   beforeAll(async () => {
//     await page.goto('http://127.0.0.1:8000/');
//     await expect(page).toClick('a[href="#create"]', { text: 'Editor' })
//     await page.waitFor(1000)
//   })

//   it('checks for headline', async () => {
//     await expect_value_in_selector_textContent('#bfeditor-menudiv > h3', 'Create Resource')
//   })

//   it('checks for default menu of profiles', async () => {
//     await expect_value_in_selector_textContent('#bfeditor-menudiv > ul:nth-child(2) > li > a', 'Monograph')
//     await expect_value_in_selector_textContent('#bfeditor-menudiv > ul:nth-child(3) > li > a', 'Notated Music')
//     await expect_value_in_selector_textContent('#bfeditor-menudiv > ul:nth-child(4) > li > a', 'Serial')
//     await expect_value_in_selector_textContent('#bfeditor-menudiv > ul:nth-child(5) > li > a', 'Cartographic')
//     await expect_value_in_selector_textContent('#bfeditor-menudiv > ul:nth-child(6) > li > a', 'Sound Recording: Audio CD')
//     await expect_value_in_selector_textContent('#bfeditor-menudiv > ul:nth-child(7) > li > a', 'Sound Recording: Audio CD-R')
//     await expect_value_in_selector_textContent('#bfeditor-menudiv > ul:nth-child(8) > li > a', 'Sound Recording: Analog')
//     await expect_value_in_selector_textContent('#bfeditor-menudiv > ul:nth-child(9) > li > a', 'Moving Image: BluRay DVD')
//     await expect_value_in_selector_textContent('#bfeditor-menudiv > ul:nth-child(10) > li > a', 'Moving Image: 35mm Feature Film')
//     await expect_value_in_selector_textContent('#bfeditor-menudiv > ul:nth-child(11) > li > a', 'Prints and Photographs')
//     await expect_value_in_selector_textContent('#bfeditor-menudiv > ul:nth-child(12) > li > a', 'Rare Materials')
//     await expect_value_in_selector_textContent('#bfeditor-menudiv > ul:nth-child(13) > li > a', 'Authorities')
//   })

  it('checks for profile sub-menu', async () => {
//     // sp-0 is Monograph
//     await expect_value_in_selector_textContent('#sp-0_0', 'Instance')
//     await expect_value_in_selector_textContent('#sp-0_1', 'Work')
//     // sp-9 is Moving Image: BluRay DVD
//     await expect_value_in_selector_textContent('#sp-9_0', 'Physical Description')
  })

//   it('checks for Authorities sub-menu', async () => {
//     await expect_value_in_selector_textContent('#sp-11_0', 'Person')
//     await expect_value_in_selector_textContent('#sp-11_1', 'Family')
//     await expect_value_in_selector_textContent('#sp-11_2', 'Corporate Body')
//     await expect_value_in_selector_textContent('#sp-11_3', 'Conference')
//     await expect_value_in_selector_textContent('#sp-11_4', 'Jurisdiction')
//   })

//   async function expect_value_in_selector_textContent(sel, value) {
//     const sel_text  = await page.$eval(sel, e => e.textContent)
//     expect(sel_text).toBe(value)
//   }
})
