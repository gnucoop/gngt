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
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

import {TranslateModule} from '@ngx-translate/core';

import {
  AuthModule as CoreAuthModule,
  AuthUserInteractionsService as CoreAuthUserInteractionsService
} from '@gngt/core/auth';
import {CommonModule as GngtCommonModule} from '@gngt/core/common';

import {AuthUserInteractionsService} from './auth-user-interactions';
import {LoginComponent} from './login';
import {LogoutConfirmDialogComponent} from './logout-confirm-dialog';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    TranslateModule,
    CoreAuthModule,
    GngtCommonModule
  ],
  declarations: [
    LoginComponent,
    LogoutConfirmDialogComponent
  ],
  exports: [
    LoginComponent
  ],
  entryComponents: [
    LogoutConfirmDialogComponent
  ],
  providers: [
    {
      provide: CoreAuthUserInteractionsService,
      useClass: AuthUserInteractionsService,
      deps: [MatDialog, MatSnackBar]
    }
  ]
})
export class AuthModule { }
