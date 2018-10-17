describe('Profiles load', () => {

  beforeAll(async () => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    await page.goto('http://127.0.0.1:8000/');
    await expect(page).toClick('a[href="#create"]', { text: 'Editor' })
    await page.waitFor(1000)
  });

  it('loads profile for Monograph Instance', async () => {

    const monograph_sel = 'ul.nav-sidebar > li:first-child > a:first-child'
    await expect(page).toClick(monograph_sel, { text: 'Monograph' })

    const instance_sel = 'a#sp-0_0'
    await expect(page).toClick(instance_sel, { text: 'Instance' })

    await page.waitFor(1000)

    // await page.screenshot({path: 'screenshot.png', fullPage: true})

    const ptitle_sel = 'div#bfeditor-formdiv > form > div > h4'
    const profile_title = await page.$eval(ptitle_sel, e => e.textContent)
    await expect(profile_title).toMatch(/BIBFRAME Instance/)
  })
})
