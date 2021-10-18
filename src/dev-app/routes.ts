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

import {Routes} from '@angular/router';
import {DevApp404} from './dev-app/dev-app-404';
import {DevAppHome} from './dev-app/dev-app-home';

export const DEV_APP_ROUTES: Routes = [
  {path: '', component: DevAppHome},
  {
    path: 'ion-admin-edit',
    loadChildren: () =>
        import('./ion-admin-edit/admin-edit-demo-module').then(m => m.AdminEditDemoModule),
  },
  {
    path: 'ion-admin-list',
    loadChildren: () =>
        import('./ion-admin-list/admin-list-demo-module').then(m => m.AdminListDemoModule),
  },
  {
    path: 'ion-login',
    loadChildren: () => import('./ion-login/login-demo-module').then(m => m.LoginDemoModule),
  },
  {
    path: 'mat-admin-edit',
    loadChildren: () =>
        import('./mat-admin-edit/admin-edit-demo-module').then(m => m.AdminEditDemoModule),
  },
  {
    path: 'mat-admin-list',
    loadChildren: () =>
        import('./mat-admin-list/admin-list-demo-module').then(m => m.AdminListDemoModule)
  },
  {
    path: 'mat-calendar',
    loadChildren: () =>
        import('./mat-calendar/calendar-demo-module').then(m => m.CalendarDemoModule)
  },
  {
    path: 'mat-login',
    loadChildren: () => import('./mat-login/login-demo-module').then(m => m.LoginDemoModule),
  },
  {
    path: 'sync',
    loadChildren: () => import('./sync/sync-demo-module').then(m => m.SyncDemoModule),
  },
  {
    path: 'examples',
    loadChildren: () =>
        import('./examples-page/examples-page-module').then(m => m.ExamplesPageModule)
  },
  {path: '**', component: DevApp404},
];
