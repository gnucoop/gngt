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

import {DemoApp, Home} from './demo-app';

import {AdminEditDemo} from '../admin-edit/admin-edit-demo';
import {LoginDemo} from '../login/login-demo';

import {ExamplesPage} from '../examples-page/examples-page';

export const DEMO_APP_ROUTES: Routes = [
  {path: '', component: DemoApp, children: [
    {path: '', component: Home},
    {path: 'admin-edit', component: AdminEditDemo},
    {path: 'login', component: LoginDemo},
    {path: 'examples', component: ExamplesPage},
  ]}
];

export const ALL_ROUTES: Routes = [
  {path: '',  component: DemoApp, children: DEMO_APP_ROUTES},
];
