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

import {BooleanInput} from '@angular/cdk/coercion';
import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation
} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';
import {AdminEditComponent as BaseAdminEditComponent} from '@gngt/core/admin';
import {Model} from '@gngt/core/common';
import {ModelActionTypes, State as ModelState} from '@gngt/core/model';

@Component({
  selector: 'gngt-admin-edit',
  templateUrl: 'edit.html',
  styleUrls: ['edit.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AdminEditComponent<
    T extends Model = Model,
    S extends ModelState<T> = ModelState<T>,
    A extends ModelActionTypes = ModelActionTypes
  > extends BaseAdminEditComponent<T, S, A> {
  constructor(cdr: ChangeDetectorRef, fb: FormBuilder, router: Router) {
    super(cdr, fb, router);
  }

  static ngAcceptInputType_canSave: BooleanInput;
  static ngAcceptInputType_hideSaveButton: BooleanInput;
  static ngAcceptInputType_readonly: BooleanInput;
}
