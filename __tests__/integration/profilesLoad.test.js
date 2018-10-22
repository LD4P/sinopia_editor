describe('Profiles load', () => {

  beforeAll(async () => {
    // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    await page.goto('http://127.0.0.1:8000/__tests__/integration/index.html');
    await expect(page).toClick('a[href="#create"]', { text: 'Editor' })
    await page.waitFor(1000)
  })

  describe('loads profile for Monograph Instance', () => {
    beforeAll(async () => {
      const monograph_sel = 'ul.nav-sidebar > li:first-child > a:first-child'
      await expect(page).toClick(monograph_sel, { text: 'Monograph' })
      const instance_sel = 'a#sp-0_0'
      await expect(page).toClick(instance_sel, { text: 'Instance' })
      await page.waitFor(1000)
    })

    it('displays profile title', async () => {
      await expect_regex_in_selector_textContent('div#bfeditor-formdiv > form > div > h4', /^BIBFRAME Instance/)
    })
    it('displays appropriate input fields and labels', async () => {
      // TODO: full input field functionality #54 - separate test file, perhaps
      const edition_label_sel = 'label[title="http://access.rdatoolkit.org/2.5.html"]'
      await expect_value_in_selector_textContent(`${edition_label_sel} > a`, 'Edition Statement (RDA 2.5)')
      var sel_attr_text = await page.$eval('input[placeholder="Edition Statement (RDA 2.5)"]', e => e.getAttribute('type'))
      expect(sel_attr_text).toMatch('text')

      const pub_date_label_sel = 'label[title="http://id.loc.gov/ontologies/bflc.html#p_projectedProvisionDate"]'
      await expect_value_in_selector_textContent(`${pub_date_label_sel} > a`, 'Projected publication date (YYMM)')
      sel_attr_text = await page.$eval('input[placeholder="Projected publication date (YYMM)"]', e => e.getAttribute('type'))
      expect(sel_attr_text).toMatch('text')
    })

    describe('controlled vocabulary for input field', () => {
      let mode_of_issuance_sel = 'div#bfeditor-formdiv > form > div > div.form-group:nth-child(11)'
      let input_div_sel = `${mode_of_issuance_sel} > div.col-sm-8`
      let button_group_sel = `${input_div_sel} > div.form-group > div.btn-toolbar > div.btn-group`
      let twitter_span_sel = `${input_div_sel} > span.twitter-typeahead`

      it('displays populated default value and trash icon', async () => {
        await expect_value_in_selector_textContent(`${button_group_sel} > button.btn-default[title="single unit"]`, 'single unit')
        await expect_sel_to_exist(`${button_group_sel} > button.btn-danger > span.glyphicon-trash`)
      })
      it('can delete existing value', async () => {
        await expect_sel_to_exist(`${button_group_sel} > button.btn-default[title="single unit"]`)
        await page.click(`${button_group_sel} > button.btn-danger > span.glyphicon-trash`)
        await expect_sel_not_to_exist(`${button_group_sel} > button.btn-default[title="single unit"]`)
      });
      it('has twitter typehead', async () => {
        await expect_sel_to_exist(`${twitter_span_sel} > input.typeahead.form-control.tt-input`)
        await expect_sel_to_exist(`${twitter_span_sel} > span.tt-dropdown-menu > div.tt-dataset-issuance`)
      })
      it('can set value from controlled vocab', async () => {
        // TODO: see #80
        const input_sel = `${twitter_span_sel} > input.typeahead.form-control.tt-input`
        await page.click(input_sel)  // works for putting cursor there, but popupdropdown doesn't appear
        // can't find any children of `${twitter_span_sel} > span.tt-dropdown-menu > div.tt-dataset-issuance`
        //  perhaps the popup with the values is a separate window ?
        // await page.screenshot({path: 'screenshot.png', fullPage: true})
        // await page.keyboard.press('ArrowDown')
        // await page.keyboard.press('Enter')
        // await expect_value_in_selector_textContent(second_val_button_sel, 'integrating resource')
      })
    })

    it('displays appropriate single buttons to modals for fields using other profiles', async () => {
      // TODO: full modal input field functionality #55 - separate test file, perhaps
      const series_div_sel = 'div#bfeditor-formdiv > form > div > div.form-group:nth-child(10)'
      await expect_value_in_selector_textContent(`${series_div_sel} > label.control-label`, 'Series Statement')
      // TODO: modal buttons aren't loading - not retrieving profiles - #79
      // await expect_value_in_selector_textContent(`${series_div_sel} > div > div.btn-group > button`, 'Series Statement')

      const related_div_sel = 'div#bfeditor-formdiv > form > div > div.form-group:nth-child(18)'
      await expect_value_in_selector_textContent(`${related_div_sel} > label.control-label`, 'Related Manifestation')
      // TODO: modal buttons aren't loading - not retrieving profiles - #79
      // await expect_value_in_selector_textContent(`${related_div_sel} > div > div > button`, 'Related Manifestation')
    })
    it('displays appropriate multiple buttons to modals for fields using other profiles', async () => {
      // TODO: full modal input field functionality #55 - separate test file, perhaps
      const title_div_sel = 'div#bfeditor-formdiv > form > div > div.form-group:nth-child(5)'
      await expect_value_in_selector_textContent(`${title_div_sel} > label`, 'Title Information')
      // TODO: modal buttons aren't loading - not retrieving profiles - #79
      // await expect_value_in_selector_textContent(`${title_div_sel} > div > div > button`, 'Instance Title')
    })
    it('has cancel button', async () => {
      // TODO: full cancel button functionality #77 - separate test file, or here?
      await expect_value_in_selector_textContent('button#bfeditor-cancel', 'Cancel')
    })
    it('has preview button', async () => {
      // TODO: full preview button functionality #56 - separate test file, perhaps
      await expect_value_in_selector_textContent('button#bfeditor-preview', 'Preview')
    })
    it('has clone button', async () => {
      // TODO: full clone button functionality #78 - separate test file, perhaps?
      await expect_value_in_selector_textContent('button#clone-instance', ' Clone Instance')
    })
  })

  async function expect_sel_to_exist(sel) {
    const sel_text = !!(await page.$(sel))
    expect(sel_text).toEqual(true)
  }
  async function expect_sel_not_to_exist(sel) {
    const sel_text = !!(await page.$(sel))
    expect(sel_text).toEqual(false)
  }
  async function expect_regex_in_selector_textContent(sel, regex) {
    const sel_text = await page.$eval(sel, e => e.textContent)
    expect(sel_text).toMatch(regex)
  }
  async function expect_value_in_selector_textContent(sel, value) {
    const sel_text = await page.$eval(sel, e => e.textContent)
    expect(sel_text).toBe(value)
  }
})
