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

import {Directionality} from '@angular/cdk/bidi';
import {ChangeDetectorRef, Component, ElementRef, Inject, ViewEncapsulation} from '@angular/core';
import {DevAppDirectionality} from './dev-app-directionality';

/** Root component for the dev-app demos. */
@Component({
  selector: 'dev-app-layout',
  templateUrl: 'dev-app-layout.html',
  styleUrls: ['dev-app-layout.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DevAppLayout {
  dark = false;
  navGroups = [
    {
      name: 'Common',
      children:
          [
            {name: 'Examples', route: '/examples'},
            {name: 'Sync', route: '/sync'},
          ]
    },
    {
      name: 'Material',
      children:
          [
            {name: 'Admin edit', route: '/mat-admin-edit'},
            {name: 'Admin list', route: '/mat-admin-list'},
            {name: 'Calendar', route: '/mat-calendar'},
            {name: 'Login', route: '/mat-login'},
          ]
    },
    {
      name: 'Ionic',
      children:
          [
            {name: 'Admin edit', route: '/ion-admin-edit'},
            {name: 'Admin list', route: '/ion-admin-list'},
            {name: 'Login', route: '/ion-login'},
          ]
    },
  ];

  constructor(
      private _element: ElementRef<HTMLElement>,
      @Inject(Directionality) public dir: DevAppDirectionality, cdr: ChangeDetectorRef) {
    dir.change.subscribe(() => cdr.markForCheck());
  }

  toggleFullscreen() {
    // Cast to `any`, because the typings don't include the browser-prefixed methods.
    const elem = this._element.nativeElement.querySelector('.demo-content') as any;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullScreen) {
      elem.webkitRequestFullScreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.msRequestFullScreen) {
      elem.msRequestFullScreen();
    }
  }
}
