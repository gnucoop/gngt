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

import {Pipe, PipeTransform} from '@angular/core';

export function getObjectProperty(value: any, prop: string): any {
  if (prop == null) { return null; }
  if (!/\./.test(prop)) {
    return value[prop];
  }
  const props = prop.split('.');
  const propsNum = props.length;
  let curValue = value;
  for (let i = 0 ; i < propsNum ; i++) {
    curValue = curValue[props[i]];
    if (curValue == null) { return null; }
  }
  return curValue;
}

@Pipe({name: 'gngtGetObjectProperty'})
export class GetObjectProperty implements PipeTransform {
  transform(value: any, prop: string): any {
    return getObjectProperty(value, prop);
  }
}
