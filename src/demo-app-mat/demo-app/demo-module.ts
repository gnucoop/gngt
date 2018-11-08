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

import {CommonModule} from '@angular/common';
import {Injector, NgModule} from '@angular/core';
import {createCustomElement} from '@angular/elements';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterModule} from '@angular/router';

import {EXAMPLE_COMPONENTS, ExampleModule} from '@gngt/material-examples';

import {DemoGngtModule} from '../demo-gngt-module';
import {MaterialExampleModule} from '../example/example-module';
import {AdminEditDemo} from '../admin-edit/admin-edit-demo';
import {ExamplesPage} from '../examples-page/examples-page';
import {LoginDemo} from '../login/login-demo';
import {DemoApp, Home} from './demo-app';
import {DEMO_APP_ROUTES} from './routes';

@NgModule({
  imports: [
    MaterialExampleModule,
    ExampleModule,
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterModule.forChild(DEMO_APP_ROUTES),
    DemoGngtModule
  ],
  declarations: [
    ExamplesPage,
    DemoApp,
    Home,
    AdminEditDemo,
    LoginDemo,
  ],
  entryComponents: [
    DemoApp,
  ],
})
export class DemoModule {
  constructor(injector: Injector) {
    // Register examples as custom elements so that they can be inserted into the DOM dynamically
    Object.keys(EXAMPLE_COMPONENTS).forEach(key => {
      const element = createCustomElement(EXAMPLE_COMPONENTS[key].component, {injector});
      customElements.define(key, element);
    });
  }
}
