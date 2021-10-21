import {HttpClientModule} from '@angular/common/http';
import {inject, TestBed} from '@angular/core/testing';
import {TranslocoService} from '@ngneat/transloco';

import {TranslationsModule} from './index';

describe('MissingTranslationHandler', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, TranslationsModule],
    });
  });

  it('should use translation label as translation when not available', inject(
    [TranslocoService],
    (ts: TranslocoService) => {
      const tsKey = 'test label';
      expect(ts.translate(tsKey)).toEqual(tsKey);
    },
  ));
});
