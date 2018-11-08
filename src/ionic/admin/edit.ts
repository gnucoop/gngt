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

import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation
} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {Router} from '@angular/router';

import {AdminEditComponent as BaseAdminEditComponent} from '@gngt/core/admin';
import {Model, ModelActions, reducers as fromModel} from '@gngt/core/model';

@Component({
  moduleId: module.id,
  selector: 'gngt-admin-edit',
  templateUrl: 'edit.html',
  styleUrls: ['edit.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  inputs: [
    'title',
    'listUrl',
    'cancelLabel',
    'saveLabel',
    'service',
    'fields',
    'id'
  ]
})
export class AdminEditComponent<
    T extends Model,
    S extends fromModel.State<T>,
    A1 extends ModelActions.ModelGetAction,
    A2 extends ModelActions.ModelListAction,
    A3 extends ModelActions.ModelCreateAction<T>,
    A4 extends ModelActions.ModelUpdateAction<T>,
    A5 extends ModelActions.ModelPatchAction<T>,
    A6 extends ModelActions.ModelDeleteAction<T>,
    A7 extends ModelActions.ModelDeleteAllAction<T>
  > extends BaseAdminEditComponent<T, S, A1, A2, A3, A4, A5, A6, A7> {
  constructor(cdr: ChangeDetectorRef, fb: FormBuilder, router: Router) {
    super(cdr, fb, router);
  }
}
