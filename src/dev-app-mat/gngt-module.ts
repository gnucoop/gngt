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

import {NgModule} from '@angular/core';

import {SyncModule} from '@gngt/core/sync';
import {AdminModule} from '@gngt/material/admin';
import {AuthModule} from '@gngt/material/auth';
import {CalendarModule} from '@gngt/material/calendar';

/**
 * NgModule that includes all Material modules that are required to serve the demo-app.
 */
@NgModule({
  imports: [
    SyncModule.forRoot({
      localDatabaseName: 'gngt_demo',
      baseUrl: 'http://127.0.0.1:8000/sync',
      changesPath: 'changes',
      docsPath: 'docs',
    })
  ],
  exports: [
    AdminModule,
    AuthModule,
    CalendarModule,
  ]
})
export class DevAppGngtModule {}
