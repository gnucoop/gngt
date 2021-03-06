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

import {HttpClient} from '@angular/common/http';
import {Optional} from '@angular/core';
import {
  Model,
  ModelListParams,
  ModelListResult,
  ModelManager as BaseModelManager,
  ModelQueryParams
} from '@gngt/core/common';
import {SyncService} from '@gngt/core/sync';
import {Observable} from 'rxjs';

import {ModelOptions} from './model-options';


export abstract class ModelManager<M extends Model = Model> extends BaseModelManager {
  private _baseUrl: string;
  get baseUrl(): string {
    return this._baseUrl;
  }

  private _useTrailingSlash = false;

  constructor(
      config: ModelOptions,
      endPoint: string,
      protected _http: HttpClient,
      @Optional() syncService?: SyncService,
  ) {
    super();
    this._endPoint = endPoint;
    this._baseUrl = `${config.baseApiUrl}${this._endPoint}`;
    this._useTrailingSlash = config.addTrailingSlash != null ? config.addTrailingSlash : false;
    if (syncService != null && config.syncModel) {
      if (config.tableName == null) {
        throw new Error(`Table name must be set for model ${this._endPoint}`);
      }
      syncService.registerSyncModel(this._baseUrl, config.tableName);
    }
  }

  get(id: number): Observable<M> {
    return this._http.get<M>(this._getObjectUrl(id));
  }

  list(options?: ModelListParams): Observable<ModelListResult<M>> {
    const params = this._listParamsToQueryParameters(options);
    return this._http.get<ModelListResult<M>>(`${this._getListUrl()}${params}`);
  }

  create(data: M): Observable<M> {
    return this._http.post<M>(this._getListUrl(), data);
  }

  update(id: number, data: M): Observable<M> {
    return this._http.put<M>(this._getObjectUrl(id), data);
  }

  patch(id: number, data: M): Observable<M> {
    return this._http.patch<M>(this._getObjectUrl(id), data);
  }

  delete(id: number): Observable<M> {
    return this._http.delete<M>(this._getObjectUrl(id));
  }

  deleteAll(ids: number[]): Observable<M> {
    let url = `${this._baseUrl}/delete_all`;
    if (this._useTrailingSlash) {
      url = `${url}/`;
    }
    return this._http.post<M>(url, {ids});
  }

  query(params: ModelQueryParams): Observable<ModelListResult<M>> {
    let url = `${this._baseUrl}/query`;
    if (this._useTrailingSlash) {
      url = `${url}/`;
    }
    return this._http.post<ModelListResult<M>>(url, params);
  }

  private _getObjectUrl(id: number): string {
    let url = `${this._baseUrl}/${id}`;
    if (this._useTrailingSlash) {
      url = `${url}/`;
    }
    return url;
  }

  private _getListUrl(): string {
    let url = this._baseUrl;
    if (this._useTrailingSlash) {
      url = `${url}/`;
    }
    return url;
  }

  private _listParamsToQueryParameters(options?: ModelListParams): string {
    let params = '';
    const paramsArray: string[] = [];
    if (options) {
      if (options.limit) {
        paramsArray.push(`limit=${options.limit}`);
      }
      if (options.start) {
        paramsArray.push(`start=${options.start}`);
      }
      if (options.sort) {
        const props = Object.keys(options.sort);
        paramsArray.push(`sort=${props.map(p => `${p}:${options.sort![p]}`).join(',')}`);
      }
      if (options.fields) {
        paramsArray.push(`fields=${options.fields.join(',')}`);
      }
      if (options.joins) {
        paramsArray.push(`joins=${
            options.joins
                .map(j => {
                  const join = `${j.model}.${j.property}`;
                  if (j.fields) {
                    return `${join}.${j.fields.join(';')}`;
                  }
                  return join;
                })
                .join(',')}`);
      }
      if (paramsArray.length > 0) {
        params = `?${paramsArray.join('&')}`;
      }
    }
    return params;
  }
}
