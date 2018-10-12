describe('Browse', () => {
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:8000/');
  });

  it('displays a search input field for the datatable', async () => {
    const search_label = await page.$eval("#table_id_filter > label", e => e.textContent)
    const search_input = await page.$eval('#table_id_filter > label > input[type="search"]', e => e.getAttribute("type"))
    await expect(search_label).toMatch(/Search:/)
    await expect(search_input).toMatch(/search/)
  })

  it('displays datatable columns', async () => {
    const id_column = await page.$eval("#table_id > thead > tr > th:nth-child(1)", e => e.textContent)
    const name_column = await page.$eval("#table_id > thead > tr > th:nth-child(2)", e => e.textContent)
    const title_column = await page.$eval("#table_id > thead > tr > th:nth-child(3)", e => e.textContent)
    const lccn_column = await page.$eval("#table_id > thead > tr > th:nth-child(4)", e => e.textContent)
    const comment_column = await page.$eval("#table_id > thead > tr > th:nth-child(5)", e => e.textContent)
    const modified_column = await page.$eval("#table_id > thead > tr > th:nth-child(6)", e => e.textContent)
    const edit_column = await page.$eval("#table_id > thead > tr > th:nth-child(7)", e => e.textContent)
    await expect(id_column).toMatch(/id/)
    await expect(name_column).toMatch(/name/)
    await expect(title_column).toMatch(/title/)
    await expect(lccn_column).toMatch(/LCCN/)
    await expect(comment_column).toMatch(/comment/)
    await expect(modified_column).toMatch(/modified/)
    await expect(edit_column).toMatch(/edit/)
  })

  it('loads datatable js, which has Previous and Next pagination links', async () => {
    const previous = await page.$eval('#table_id_previous', e => e.textContent)
    const next = await page.$eval('#table_id_next', e => e.textContent)
    await expect(previous).toMatch(/Previous/)
    await expect(next).toMatch(/Next/)
  })
})
