/**
 * @license
 * Copyright (C) Gnucoop soc. coop.
 *
 * This file is part of the Gnucoop Angular Toolkit (gngt).
 *
 * Gnucoop Angular Toolkit (gngt) is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Gnucoop Angular Toolkit (gngt) is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Gnucoop Angular Toolkit (gngt).  If not, see http://www.gnu.org/licenses/.
 *
 */

import {Directionality} from '@angular/cdk/bidi';
import {FullscreenOverlayContainer, OverlayContainer} from '@angular/cdk/overlay';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {GicModule} from '@gic/angular';
import {SyncModule} from '@gngt/core/sync';
import {IonicModule} from '@ionic/angular';
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import {TranslateModule} from '@ngx-translate/core';
import {DevAppComponent} from './dev-app';
import {DevAppDirectionality} from './dev-app/dev-app-directionality';
import {DevAppModule} from './dev-app/dev-app-module';
import {DEV_APP_ROUTES} from './routes';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    DevAppModule,
    EffectsModule.forRoot([]),
    GicModule.forRoot(),
    HttpClientModule,
    IonicModule.forRoot(),
    RouterModule.forRoot(DEV_APP_ROUTES),
    StoreModule.forRoot({}),
    SyncModule.forRoot({baseUrl: '/', localDatabaseName: 'gngt_demo_db'}),
    TranslateModule.forRoot(),
  ],
  declarations: [
    DevAppComponent,
  ],
  providers: [
    {provide: OverlayContainer, useClass: FullscreenOverlayContainer},
    {provide: Directionality, useClass: DevAppDirectionality},
  ],
  bootstrap: [DevAppComponent],
})
export class MainModule {
}
