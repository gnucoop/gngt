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
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterModule} from '@angular/router';

import {TranslateModule} from '@ngx-translate/core';

import {CommonModule as GngtCommonModule} from '@gngt/core/common';
import {
  AdminUserInteractionsService as CoreAdminUserInteractionsService
} from '@gngt/core/admin';

import {AdminUserInteractionsService} from './admin-user-interactions';
import {AdminDeleteConfirmDialogComponent} from './delete-confirm';
import {AdminEditComponent} from './edit';
import {AdminListComponent} from './list';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatToolbarModule,
    RouterModule,
    TranslateModule,
    GngtCommonModule
  ],
  declarations: [
    AdminDeleteConfirmDialogComponent,
    AdminEditComponent,
    AdminListComponent
  ],
  exports: [
    AdminEditComponent,
    AdminListComponent
  ],
  entryComponents: [
    AdminDeleteConfirmDialogComponent
  ],
  providers: [
    {
      provide: CoreAdminUserInteractionsService,
      useClass: AdminUserInteractionsService,
      deps: [MatDialog]
    }
  ]
})
export class AdminModule {}
