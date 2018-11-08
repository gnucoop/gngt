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

import {AlertController, ToastController} from '@ionic/angular';

import {from, Observable} from 'rxjs';
import {map, mapTo, switchMap} from 'rxjs/operators';

import {TranslateService} from '@ngx-translate/core';

import {AuthUserInteractionsService as CoreAuthUserInteractionsService} from '@gngt/core/auth';

export class AuthUserInteractionsService extends CoreAuthUserInteractionsService {
  constructor(
    private ts: TranslateService, private alert: AlertController, private toast: ToastController
  ) {
    super();
  }

  askLogoutConfirm(): Observable<boolean> {
    const strings = [
      'Are you sure you want to logout?',
      'Cancel',
      'Ok'
    ];
    return this.ts.get(strings).pipe(
      switchMap(ts => from(this.alert.create({
        message: ts[0],
        buttons: [{text: ts[1], role: 'cancel'}, {text: ts[2], role: 'confirm'}]
      }))),
      switchMap(alert => from(alert.present()).pipe(mapTo(alert))),
      switchMap(alert => from(alert.onDidDismiss())),
      map(evt => evt.role === 'confirm')
    );
  }

  showLoginError(error: string): void {
    this.toast.create({
      message: error,
      showCloseButton: false,
      duration: 3000
    }).then(t => t.present());
  }
}
