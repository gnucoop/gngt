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

import {AsyncPipe} from '@angular/common';
import {ChangeDetectorRef, Pipe, PipeTransform} from '@angular/core';
import {Observable} from 'rxjs';

import {AdminEditFieldChoice} from './edit-field-choice';

@Pipe({name: 'gngtChoices', pure: false})
export class ChoicesPipe implements PipeTransform {
  private _asyncPipe: AsyncPipe;

  constructor(cdr: ChangeDetectorRef) {
    this._asyncPipe = new AsyncPipe(cdr);
  }

  transform(value: AdminEditFieldChoice[]|Observable<AdminEditFieldChoice[]>|
            Promise<AdminEditFieldChoice[]>|null|undefined): AdminEditFieldChoice[] {
    if (value == null) {
      return [];
    }
    if (Array.isArray(value)) {
      return value;
    }
    return this._asyncPipe.transform<AdminEditFieldChoice[]>(value as any) || [];
  }
}
