// Copyright 2018 Stanford University see Apache2.txt for license
import expect from 'expect-puppeteer'


describe('Basic end to end Sinopia Linked Data Editor', () => {

  beforeAll(async () => {
    await page.goto('http://127.0.0.1:8080/');
  });

  it('displays "Linked Data Editor" and "Profile Editor" in menu', async () => { 
    await expect(page).toMatch('Linked Data Editor')
    await expect(page).toMatch('Profile Editor')
  });
});
