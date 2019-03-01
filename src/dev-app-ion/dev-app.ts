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

import {Component, ElementRef, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';

import {NavController} from '@ionic/angular';

/**
 * DemoApp with toolbar and sidenav.
 */
@Component({
  moduleId: module.id,
  selector: 'dev-app',
  templateUrl: 'dev-app.html',
  styleUrls: ['dev-app.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DevAppComponent {
  dark = false;
  navItems = [
    {name: 'Examples', route: '/examples'},
    {name: 'Admin Edit', route: '/admin-edit'},
    {name: 'Admin List', route: '/admin-list'},
    {name: 'Calendar', route: '/calendar'},
    {name: 'Login', route: '/login'},
  ];

  constructor(
    private _router: Router,
    private _navCtrl: NavController,
    private _element: ElementRef<HTMLElement>) {}

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

  navTo(route: string) {
    this._navCtrl.setDirection('forward');
    this._router.navigateByUrl(route);
  }
}

/**
 * Home component for welcome message in DemoApp.
 */
@Component({
  selector: 'home',
  template: `
    <p>Welcome to the development demos for Gngt!</p>
    <p>Open the sidenav to select a demo.</p>
  `,
})
export class DevAppHome {}
