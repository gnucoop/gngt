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

import {Routes} from '@angular/router';
import {DevApp404} from './dev-app-404';
import {DevAppHome} from './dev-app-home';

export const DEV_APP_ROUTES: Routes = [
  {path: '', component: DevAppHome},
  {path: 'ion-admin-edit',
    loadChildren: 'ion-admin-edit/admin-edit-demo-module#AdminEditDemoModule'},
  {path: 'ion-admin-list',
    loadChildren: 'ion-admin-list/admin-list-demo-module#AdminListDemoModule'},
  {path: 'ion-login', loadChildren: 'ion-login/login-demo-module#LoginDemoModule'},
  {path: 'mat-admin-edit',
    loadChildren: 'mat-admin-edit/admin-edit-demo-module#AdminEditDemoModule'},
  {path: 'mat-admin-list',
    loadChildren: 'mat-admin-list/admin-list-demo-module#AdminListDemoModule'},
  {path: 'mat-calendar', loadChildren: 'mat-calendar/calendar-demo-module#CalendarDemoModule'},
  {path: 'mat-login', loadChildren: 'mat-login/login-demo-module#LoginDemoModule'},
  {path: 'sync', loadChildren: 'sync/sync-demo-module#SyncDemoModule'},
  {path: 'examples', loadChildren: 'examples-page/examples-page-module#ExamplesPageModule'},
  {path: '**', component: DevApp404},
];
