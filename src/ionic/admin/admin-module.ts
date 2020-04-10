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

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {GicModule} from '@gic/angular';
import {GngtAdminModule as CoreModule} from '@gngt/core/admin';
import {CommonModule as GngtCommonModule} from '@gngt/core/common';
import {IonicModule} from '@ionic/angular';
import {TranslateModule} from '@ngx-translate/core';

import {AdminUserInteractionsService} from './admin-user-interactions';
import {AdminEditComponent} from './edit';
import {InputTypePipe} from './input-type-pipe';
import {AdminListComponent} from './list';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    GicModule,
    GngtCommonModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
  ],
  declarations: [
    AdminEditComponent,
    AdminListComponent,
    InputTypePipe,
  ],
  exports: [
    AdminEditComponent,
    AdminListComponent,
  ],
  providers: [
    AdminUserInteractionsService,
  ]
})
export class AdminModule {
}
