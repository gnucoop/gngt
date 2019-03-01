import {browser, by, element, ElementFinder} from 'protractor';

describe('login', () => {
  describe('disabling behavior', () => {
    beforeEach(async () => await browser.get('/login'));

    it('should prevent form input when disabled', async () => {
      let fields: ElementFinder[] = await element.all(by.tagName('mat-form-field'));
      for (let i = 0 ; i < fields.length ; i++) {
        const cls = await fields[i].getWebElement().getAttribute('class');
        expect(cls).not.toMatch('mat-form-field-disabled');
      }

      element(by.id('disable-toggle')).click();

      for (let i = 0 ; i < fields.length ; i++) {
        const cls = await fields[i].getWebElement().getAttribute('class');
        expect(cls).toMatch('mat-form-field-disabled');
      }
    });
  });
});
