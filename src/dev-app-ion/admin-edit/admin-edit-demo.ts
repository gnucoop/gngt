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

import {Component} from '@angular/core';

import {of as obsOf} from 'rxjs';

import {
  AdminEditField, AdminEditFieldType as ft, AdminEditFieldSubtype as fst
} from '@gngt/core/admin';

import {AdminModelMockService} from '../admin-mocks';

const choices = obsOf([
  {label: 'Choice 1', value: 1},
  {label: 'Choice 2', value: 2},
  {label: 'Choice 3', value: 3},
  {label: 'Choice 4', value: 4},
]);

@Component({
  moduleId: module.id,
  selector: 'admin-edit-demo',
  templateUrl: 'admin-edit-demo.html',
  styleUrls: ['admin-edit-demo.css'],
})
export class AdminEditDemo {
  readonly service = new AdminModelMockService();
  readonly fields: AdminEditField[] = [
    {name: 'foo', label: 'Foo', type: ft.Input, subtype: fst.Text},
    {name: 'bar', label: 'Bar', type: ft.Input, subtype: fst.Text},
    {name: 'baz', label: 'Baz', type: ft.Input, subtype: fst.Number},
    {name: 'qux', label: 'Qux', type: ft.Radio, choices}
  ];
}
