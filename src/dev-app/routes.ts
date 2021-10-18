/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
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
