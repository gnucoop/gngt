import {browser, by, element} from 'protractor';

describe('gngt-calendar', () => {
  beforeEach(async () => await browser.get('/mat-calendar'));

  it('should show a calendar', () => {
    expect(element(by.tagName('gngt-calendar'))).toBeDefined();
  });
});
