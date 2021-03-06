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
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {RouterModule} from '@angular/router';
import {GngtAdminModule as CoreModule} from '@gngt/core/admin';
import {CommonModule as GngtCommonModule} from '@gngt/core/common';
import {TranslateModule} from '@ngx-translate/core';

import {AdminUserInteractionsService} from './admin-user-interactions';
import {AdminDeleteConfirmDialogComponent} from './delete-confirm';
import {AdminEditComponent} from './edit';
import {AdminListComponent} from './list';
import {AdminListCellDirective} from './list-cell';

@NgModule({
  imports: [
    CommonModule,         CoreModule,       GngtCommonModule,    MatAutocompleteModule,
    MatButtonModule,      MatCardModule,    MatCheckboxModule,   MatDialogModule,
    MatFormFieldModule,   MatIconModule,    MatInputModule,      MatPaginatorModule,
    MatProgressBarModule, MatRadioModule,   MatSelectModule,     MatSortModule,
    MatTableModule,       MatToolbarModule, ReactiveFormsModule, RouterModule,
    TranslateModule,
  ],
  declarations: [
    AdminDeleteConfirmDialogComponent,
    AdminEditComponent,
    AdminListCellDirective,
    AdminListComponent,
  ],
  exports: [
    AdminEditComponent,
    AdminListCellDirective,
    AdminListComponent,
  ],
  entryComponents: [
    AdminDeleteConfirmDialogComponent,
  ],
  providers: [
    AdminUserInteractionsService,
  ]
})
export class AdminModule {
}
