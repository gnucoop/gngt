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
  AfterViewInit, Directive, ElementRef, Input, Host, OnDestroy, Optional, Renderer2
} from '@angular/core';

import {Subscription} from 'rxjs';

import {Input as IonInput} from '@ionic/angular';

@Directive({selector: '[gngtInputAriaLabel]'})
export class InputAriaLabelDirective implements AfterViewInit, OnDestroy {
  private _inputLoadSub: Subscription = Subscription.EMPTY;

  constructor(
    @Host() @Optional() private _input: IonInput,
    private _el: ElementRef,
    private _renderer: Renderer2
  ) {
    if (_input) {
      _input.ionInputDidLoad.subscribe(() => {
        this._updateLabel();
      });
    }
  }

  private _gngtInputAriaLabel: string;
  @Input('gngtInputAriaLabel') set gngtInputAriaLabel(gngtInputAriaLabel: string) {
    this._gngtInputAriaLabel = gngtInputAriaLabel;
    this._updateLabel();
  }

  ngAfterViewInit(): void {
    this._updateLabel();
  }

  ngOnDestroy(): void {
    this._inputLoadSub.unsubscribe();
  }

  private _updateLabel(): void {
    if (this._input && this._el) {
      const el = this._el.nativeElement as HTMLElement;
      if (el) {
        this._setLabelOnChildren(el.getElementsByTagName('input'));

        if (el.shadowRoot) {
          this._setLabelOnChildren(el.shadowRoot.querySelectorAll('input'));
        }
      }
    }
  }

  private _setLabelOnChildren(
    inputs: HTMLCollectionOf<HTMLInputElement> | NodeListOf<HTMLInputElement>
  ): void {
    const inputsNum = inputs.length;
    for (let i = 0 ; i < inputsNum ; i++) {
      const input = inputs.item(i);
      if (input) {
        this._setLabel(input);
      }
    }
  }

  private _setLabel(el: HTMLInputElement): void {
    this._renderer.setAttribute(el, 'aria-label', this._gngtInputAriaLabel);
  }
}
