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

import {Component, Input} from '@angular/core';
import {EXAMPLE_COMPONENTS} from '@gngt/ionic-examples';

/** Displays a set of gngt examples in a mat-accordion. */
@Component({
  selector: 'ionic-example-list',
  template: `
    <ion-list>
      <ion-item *ngFor="let id of ids">
        <ion-label>
          <div class="header">
            <div class="title"> {{exampleComponents[id]?.title}} </div>
            <div class="id"> <{{id}}> </div>
          </div>
        </ion-label>

        <ionic-example [id]="id"></ionic-example>
      </ion-item>
    </ion-list>
  `,
  styles: [`
  `]
})
export class ExampleList {
  /** Type of examples being displayed. */
  @Input() type: string;

  /** IDs of the examples to display. */
  @Input() ids: string[];

  @Input()
  get expandAll(): boolean { return this._expandAll; }
  set expandAll(v: boolean) { this._expandAll = v != null && `${v}` !== 'false'; }
  _expandAll: boolean;

  exampleComponents = EXAMPLE_COMPONENTS;
}
