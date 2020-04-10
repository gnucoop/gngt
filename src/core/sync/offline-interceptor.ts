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

import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {RegisteredModel} from './registered-model';
import {SYNC_REGISTERED_MODELS} from './registered-models';
import {SyncService} from './sync-service';

@Injectable()
export class OfflineInterceptor implements HttpInterceptor {
  constructor(private _syncService: SyncService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError((e: HttpErrorResponse) => {
      if (e.status === 0) {
        const models = this._checkOfflineRequest(req);
        if (models.length > 0) {
          return this._doOfflineRequest(req, models[0], e);
        }
      }
      return throwError(e);
    }));
  }

  private _doOfflineRequest(
      req: HttpRequest<any>, model: RegisteredModel,
      reqError: HttpErrorResponse): Observable<HttpEvent<any>> {
    const method = req.method.toLowerCase();
    const {exactMatch, relativeUrl} = this._analyzeRequestUrl(req, model);
    if (exactMatch) {
      if (method === 'get') {
        const limit = <any>req.params.get('limit');
        const start = <any>req.params.get('start');
        const sort = <any>req.params.get('sort');
        const fields = <any>req.params.get('fields');
        const joins = <any>req.params.get('joins');
        return this._syncService.list(model.tableName, {limit, start, sort, fields, joins})
            .pipe(
                catchError(_ => throwError(reqError)),
                map(res =>
                        new HttpResponse({status: 200, statusText: 'OK', url: req.url, body: res})),
            );
      } else if (method === 'post') {
        const obj = req.body;
        return this._syncService.create(model.tableName, obj)
            .pipe(
                catchError(_ => throwError(reqError)),
                map(res => new HttpResponse(
                        {status: 201, statusText: 'OK', url: req.url, body: res})));
      }
    } else {
      if (relativeUrl.length === 1) {
        const lastUrlPart = relativeUrl[0];
        if (lastUrlPart === 'delete_all') {
          const ids = req.body.ids;
          if (ids != null && ids instanceof Array && ids.length > 0) {
            return this._syncService.deleteAll(model.tableName, ids)
                .pipe(
                    catchError(_ => throwError(reqError)),
                    map(res => new HttpResponse(
                            {status: 200, statusText: 'OK', url: req.url, body: res})));
          }
        } else if (lastUrlPart === 'query') {
          const params = req.body;
          return this._syncService.query(model.tableName, params)
              .pipe(
                  catchError(_ => throwError(reqError)),
                  map(res => new HttpResponse(
                          {status: 200, statusText: 'OK', url: req.url, body: res})));
        } else {
          const id = parseInt(lastUrlPart, 10);
          if (!isNaN(id) && id > 0) {
            let op: Observable<any>|null = null;
            let successStatus: number = 200;
            const obj = req.body;
            if (method === 'get') {
              op = this._syncService.get(model.tableName, {id});
              successStatus = 201;
            } else if (method === 'patch' || method === 'put') {
              op = this._syncService.update(model.tableName, id, obj);
            } else if (method === 'delete') {
              op = this._syncService.delete(model.tableName, id);
            }
            if (op != null) {
              return op.pipe(
                  catchError(_ => throwError(reqError)),
                  map(res => new HttpResponse(
                          {status: successStatus, statusText: 'OK', url: req.url, body: res})),
              );
            }
          }
        }
      }
    }
    return throwError(reqError);
  }

  private _analyzeRequestUrl(req: HttpRequest<any>, model: RegisteredModel):
      {exactMatch: boolean, relativeUrl: string[]} {
    const exactMatch = new RegExp('^' + model.endpoint + '$').test(req.url);
    if (exactMatch) {
      return {exactMatch, relativeUrl: []};
    }
    const baseUrlParts = model.endpoint.split(/\/+/);
    const reqUrlParts = req.url.split(/\/+/);
    return {exactMatch, relativeUrl: reqUrlParts.slice(baseUrlParts.length)};
  }

  private _checkOfflineRequest(req: HttpRequest<any>): RegisteredModel[] {
    const urlParts = req.url.split('?');
    const urlPaths = urlParts[0].split('/');
    const urlPathsLen = urlPaths.length;
    let lastUrlPathIdx = urlPathsLen - 1;
    if (urlPaths[lastUrlPathIdx] === '') {
      lastUrlPathIdx -= 1;
    }
    const lastUrlPath = urlPaths[lastUrlPathIdx];
    const intVal = parseInt(lastUrlPath, 10);
    if (lastUrlPath === 'query' || (!isNaN(intVal) && `${intVal}` === lastUrlPath)) {
      urlPaths.splice(lastUrlPathIdx, 1);
    }
    const url = urlPaths.join('/');
    return SYNC_REGISTERED_MODELS.filter(m => m.endpoint === url);
  }
}
