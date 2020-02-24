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

import {AdminListHeader} from '@gngt/core/admin';
import {ModelDataSource} from '@gngt/material/model';

import {AdminModelMockService} from '../admin-mocks';

@Component({
  selector: 'admin-list-demo',
  templateUrl: 'admin-list-demo.html',
  styleUrls: ['admin-list-demo.css'],
})
export class AdminListDemo {
  readonly service = new AdminModelMockService() as any;
  readonly headers: AdminListHeader[] = [
    {column: 'foo', label: 'Foo', sortable: false},
    {column: 'bar', label: 'Bar', sortable: false},
    {column: 'baz', label: 'Baz', sortable: true},
  ];
  readonly displayedColumns: string[] = this.headers.map(h => h.column);
  readonly dataSource: ModelDataSource<any, any, any, any>;

  constructor() {
    this.dataSource = new ModelDataSource(this.service as any);
  }
}
