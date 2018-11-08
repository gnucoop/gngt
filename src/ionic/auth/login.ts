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
  ChangeDetectorRef, ChangeDetectionStrategy, Component, ViewEncapsulation
} from '@angular/core';
import {FormBuilder} from '@angular/forms';

import {Store} from '@ngrx/store';

import {LoginComponent as CoreLoginComponent, reducers as fromAuth} from '@gngt/core/auth';

@Component({
  moduleId: module.id,
  selector: 'gngt-login',
  templateUrl: 'login.html',
  styleUrls: ['login.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  inputs: ['disabled']
})
export class LoginComponent extends CoreLoginComponent {
  constructor(fb: FormBuilder, store: Store<fromAuth.State>, cdr: ChangeDetectorRef) {
    super(fb, store, cdr);
  }
}
