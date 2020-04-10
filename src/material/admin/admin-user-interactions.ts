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

import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {AdminUserInteractionsService as CoreAdminUserInteractionsService} from '@gngt/core/admin';
import {Observable} from 'rxjs';

import {AdminDeleteConfirmDialogComponent} from './delete-confirm';

@Injectable()
export class AdminUserInteractionsService extends CoreAdminUserInteractionsService {
  constructor(private _dialog: MatDialog) {
    super();
  }

  askDeleteConfirm(): Observable<boolean> {
    return this._dialog.open(AdminDeleteConfirmDialogComponent).afterClosed();
  }
}
