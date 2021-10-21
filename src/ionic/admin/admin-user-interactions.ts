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

import {Injectable} from '@angular/core';
import {AdminUserInteractionsService as CoreAdminUserInteractionsService} from '@gngt/core/admin';
import {AlertController} from '@ionic/angular';
import {OverlayEventDetail} from '@ionic/core';
import {TranslocoService} from '@ngneat/transloco';
import {from, Observable} from 'rxjs';
import {map, mapTo, switchMap} from 'rxjs/operators';

@Injectable()
export class AdminUserInteractionsService extends CoreAdminUserInteractionsService {
  constructor(private _alert: AlertController, private _ts: TranslocoService) {
    super();
  }

  askDeleteConfirm(): Observable<boolean> {
    const strings = ['Are you sure you want to delete?', 'Cancel', 'Ok'];
    return from(
      this._alert.create({
        message: this._ts.translate(strings[0]),
        buttons: [
          {text: this._ts.translate(strings[1]), role: 'cancel'},
          {text: this._ts.translate(strings[2]), role: 'confirm'},
        ],
      }),
    ).pipe(
      switchMap(alert => from((alert as HTMLIonAlertElement).present()).pipe(mapTo(alert))),
      switchMap(alert => from((alert as HTMLIonAlertElement).onDidDismiss())),
      map(evt => (evt as OverlayEventDetail<any>).role === 'confirm'),
    );
  }
}
