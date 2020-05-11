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
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {
  AUTH_OPTIONS,
  AuthModule as CoreAuthModule,
  AuthModuleOptions,
  AuthUserInteractionsService as CoreAuthUserInteractionsService,
  JWT_OPTIONS,
  JwtHelperService,
  JwtInterceptor
} from '@gngt/core/auth';
import {CommonModule as GngtCommonModule} from '@gngt/core/common';

import {AuthUserInteractionsService} from './auth-user-interactions';
import {LoginComponent} from './login';
import {LogoutConfirmDialogComponent} from './logout-confirm-dialog';

@NgModule({
  imports: [
    CommonModule,
    CoreAuthModule,
    GngtCommonModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSnackBarModule,
    ReactiveFormsModule,
  ],
  declarations: [
    LoginComponent,
    LogoutConfirmDialogComponent,
  ],
  exports: [
    LoginComponent,
  ],
  entryComponents: [
    LogoutConfirmDialogComponent,
  ],
  providers: [{
    provide: CoreAuthUserInteractionsService,
    useClass: AuthUserInteractionsService,
    deps: [MatDialog, MatSnackBar]
  }]
})
export class AuthModule {
  static forRoot(options: AuthModuleOptions): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        JwtHelperService,
        options.authOptionsProvider || {provide: AUTH_OPTIONS, useValue: options.authConfig},
        options.jwtOptionsProvider || {provide: JWT_OPTIONS, useValue: options.jwtConfig},
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
      ]
    };
  }
}
