/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, Injector, Input, OnInit, ViewContainerRef} from '@angular/core';
import {loadExampleFactory} from '@gngt/material-examples/private';

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

  constructor(private _injector: Injector,
              private _viewContainerRef: ViewContainerRef) {}

  async ngOnInit() {
    this._viewContainerRef.createComponent(await loadExampleFactory(this.id, this._injector));
  }
}
