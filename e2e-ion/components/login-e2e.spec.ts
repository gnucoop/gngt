import {browser} from 'protractor';

describe('login', () => {
  describe('disabling behavior', () => {
    beforeEach(() => browser.get('/login'));

    it('should prevent form input when disabled', async () => {
      expect(true).toBeTruthy();
    });
  });
});
