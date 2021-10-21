import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {TranslationsModule} from '@gngt/core/translations';
import {IonicModule} from '@ionic/angular';
import {TranslocoModule} from '@ngneat/transloco';

import {E2eApp} from './e2e-app';
import {E2eAppModule} from './e2e-app/e2e-app-module';
import {IonicCalendarE2eModule} from './ion-calendar/calendar-e2e-module';
import {MaterialCalendarE2eModule} from './mat-calendar/calendar-e2e-module';
import {E2E_APP_ROUTES} from './routes';

@NgModule({
  imports: [
    BrowserModule,
    E2eAppModule,
    IonicModule.forRoot(),
    NoopAnimationsModule,
    RouterModule.forRoot(E2E_APP_ROUTES),
    TranslationsModule,
    TranslocoModule,

    // E2E demos
    IonicCalendarE2eModule,
    MaterialCalendarE2eModule,
  ],
  declarations: [E2eApp],
  bootstrap: [E2eApp],
})
export class MainModule {}
