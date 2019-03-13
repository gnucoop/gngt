/**
 * @license
 * Copyright (C) 2018 Gnucoop soc. coop.
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

import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ModuleWithProviders, NgModule} from '@angular/core';

import {OfflineInterceptor} from './offline-interceptor';
import {SYNC_OPTIONS, SyncOptions} from './sync-options';
import {SyncService} from './sync-service';

@NgModule({})
export class SyncModule {
  static forRoot(opts: SyncOptions): ModuleWithProviders {
    return {
      ngModule: SyncModule,
      providers: [
        SyncService,
        {provide: HTTP_INTERCEPTORS, useClass: OfflineInterceptor, multi: true},
        {provide: SYNC_OPTIONS, useValue: opts},
      ]
    };
  }
}
