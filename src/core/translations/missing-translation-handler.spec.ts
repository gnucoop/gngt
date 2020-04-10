import {HttpClient, HttpClientModule} from '@angular/common/http';
import {async, inject, TestBed} from '@angular/core/testing';
import {TranslateLoader, TranslateModule, TranslateService} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {TranslationsModule} from './index';

describe('MissingTranslationHandler', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule, TranslationsModule,
        TranslateModule.forRoot(
            {loader: {provide: TranslateLoader, useClass: TranslateHttpLoader, deps: [HttpClient]}})
      ]
    });
  }));

  it('should use translation label as translation when not available',
     inject([TranslateService], (ts: TranslateService) => {
       const tsKey = 'test label';
       ts.get(tsKey).subscribe((trans) => {
         expect(trans).toEqual(tsKey);
       });
     }));
});
