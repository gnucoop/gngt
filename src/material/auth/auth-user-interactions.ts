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

import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

import {Observable} from 'rxjs';

import {AuthUserInteractionsService as CoreAuthUserInteractionsService} from '@gngt/core/auth';

import {LogoutConfirmDialogComponent} from './logout-confirm-dialog';

export class AuthUserInteractionsService extends CoreAuthUserInteractionsService {
  constructor(private _dialog: MatDialog, private _snackBar: MatSnackBar) {
    super();
  }

  askLogoutConfirm(): Observable<boolean> {
    return this._dialog.open(LogoutConfirmDialogComponent).afterClosed();
  }

  showLoginError(error: string): void {
    this._snackBar.open(error, undefined, {duration: 3000});
  }
}
