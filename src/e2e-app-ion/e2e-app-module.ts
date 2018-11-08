import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';

import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {AdminModule} from '@gngt/ionic/admin';
import {AuthModule} from '@gngt/ionic/auth';
import {ExampleModule} from '@gngt/ionic-examples';
import {LoginE2E} from './login/login-e2e';
import {E2EApp, Home} from './e2e-app/e2e-app';
import {E2E_APP_ROUTES} from './e2e-app/routes';


export function createTranslateLoader(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/**
 * NgModule that contains all Ionic modules that are required to serve the e2e-app.
 */
@NgModule({
  exports: [
    AdminModule,
    AuthModule
  ]
})
export class E2eIonicModule {}

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(E2E_APP_ROUTES),
    IonicModule.forRoot(),
    E2eIonicModule,
    NoopAnimationsModule,
    ExampleModule,
    ReactiveFormsModule,
    EffectsModule.forRoot([]),
    StoreModule.forRoot({}),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
    }),
  ],
  declarations: [
    E2EApp,
    Home,
    LoginE2E,
  ],
  bootstrap: [E2EApp],
  entryComponents: []
})
export class E2eAppModule { }
