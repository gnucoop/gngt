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

import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs';

import {Model, ModelListParams, ModelListResult, ModelQueryParams} from '@gngt/core/common';
// import {SyncService} from '@gngt/core/sync';
import {ModelOptions} from './model-options';


export abstract class ModelManager<M extends Model> {
  protected get endPoint(): string { return this._endPoint; }

  private _baseUrl: string;

  constructor(
    private _config: ModelOptions, private _endPoint: string, protected _http: HttpClient
  ) {
    this._baseUrl = `${this._config.baseApiUrl}${this._endPoint}`;
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
    if (this._config.addTrailingSlash) {
      url = `${url}/`;
    }
    return this._http.post<M>(url, {ids});
  }

  query(params: ModelQueryParams): Observable<ModelListResult<M>> {
    let url = `${this._baseUrl}/query`;
    if (this._config.addTrailingSlash) {
      url = `${url}/`;
    }
    return this._http.post<ModelListResult<M>>(url, params);
  }

  private _getObjectUrl(id: number): string {
    let url = `${this._baseUrl}/${id}`;
    if (this._config.addTrailingSlash) {
      url = `${url}/`;
    }
    return url;
  }

  private _getListUrl(): string {
    let url = this._baseUrl;
    if (this._config.addTrailingSlash) {
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
        paramsArray.push(`joins=${options.joins.map(j => {
          const join = `${j.model}.${j.property}`;
          if (j.fields) {
            return `${join}.${j.fields.join(';')}`;
          }
          return join;
        }).join(',')}`);
      }
      if (paramsArray.length > 0) {
        params = `?${paramsArray.join('&')}`;
      }
    }
    return params;
  }
}
