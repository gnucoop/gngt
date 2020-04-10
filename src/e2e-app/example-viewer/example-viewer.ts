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

import {Component, Injector, Input, OnInit, ViewContainerRef} from '@angular/core';
import {loadExampleFactory} from '@gngt/gngt-examples/private';

/** Loads an example component from `@angular/material-examples` */
@Component({
  selector: 'example-viewer',
  template: `
    <div *ngIf="!id">
      Could not find example {{id}}
    </div>
  `,
})
export class ExampleViewer implements OnInit {
  /** ID of the material example to display. */
  @Input() id: string;

  constructor(private _injector: Injector, private _viewContainerRef: ViewContainerRef) {}

  async ngOnInit() {
    this._viewContainerRef.createComponent(await loadExampleFactory(this.id, this._injector));
  }
}
