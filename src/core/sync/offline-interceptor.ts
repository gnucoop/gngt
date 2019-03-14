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
  HttpEvent, HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse
} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {RegisteredModel} from './registered-model';
import {SyncService} from './sync-service';

@Injectable()
export class OfflineInterceptor implements HttpInterceptor {
  private _models: RegisteredModel[] = [];

  constructor(private _syncService: SyncService) {
    this._models = [..._syncService.registeredModels];
    _syncService.modelRegister.subscribe(_ =>
      this._models = [..._syncService.registeredModels]);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((e: HttpErrorResponse) => {
        if (e.status === 0) {
          const models = this._checkOfflineRequest(req);
          if (models.length > 0) {
            return this._doOfflineRequest(req, models[0], e);
          }
        }
        return throwError(e);
      })
    );
  }

  private _doOfflineRequest(
    req: HttpRequest<any>,
    model: RegisteredModel,
    reqError: HttpErrorResponse
  ): Observable<HttpEvent<any>> {
    const method = req.method.toLowerCase();
    const {exactMatch, relativeUrl} = this._analyzeRequestUrl(req, model);
    if (method === 'get') {
      if (exactMatch) {
        const limit = <any>req.params.get('limit');
        const start = <any>req.params.get('start');
        const sort = <any>req.params.get('sort');
        const fields = <any>req.params.get('fields');
        const joins = <any>req.params.get('joins');
        return this._syncService.list(model.tableName, {limit, start, sort, fields, joins}).pipe(
          catchError(_ => throwError(reqError)),
          map(res => new HttpResponse({
            status: 200,
            statusText: 'OK',
            url: req.url,
            body: res
          })),
        );
      } else {
        if (relativeUrl.length === 1) {
          const id = parseInt(relativeUrl[0], 10);
          if (!isNaN(id) && id > 0) {
            return this._syncService.get(model.tableName, {id}).pipe(
              catchError(_ => throwError(reqError)),
              map(res => new HttpResponse({
                status: 200,
                statusText: 'OK',
                url: req.url,
                body: res
              })),
            );
          }
        }
      }
    }
    return throwError(reqError);
  }

  private _analyzeRequestUrl(
    req: HttpRequest<any>,
    model: RegisteredModel
  ): {exactMatch: boolean, relativeUrl: string[]} {
    const exactMatch = new RegExp('^' + model.endpoint + '$').test(req.url);
    if (exactMatch) { return {exactMatch, relativeUrl: []}; }
    const baseUrlParts = model.endpoint.split(/\/+/);
    const reqUrlParts = req.url.split(/\/+/);
    return {exactMatch, relativeUrl: reqUrlParts.slice(baseUrlParts.length)};
  }

  private _checkOfflineRequest(req: HttpRequest<any>): RegisteredModel[] {
    return this._models.filter(m => new RegExp(`^${m.endpoint}`).test(req.url));
  }
}
