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

import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import * as URLParse from 'url-parse';

import {JwtHelperService} from './jwt-helper';
import {JwtOptions} from './jwt-options';
import {JWT_OPTIONS} from './jwt-options-token';

@Injectable({providedIn: 'root'})
export class JwtInterceptor implements HttpInterceptor {
  tokenGetter: (() => string | null) | undefined;
  headerName: string;
  authScheme: string;
  whitelistedDomains: (string | RegExp)[];
  blacklistedRoutes: (string | RegExp)[];
  throwNoTokenError: boolean;
  skipWhenExpired: boolean;

  constructor(@Inject(JWT_OPTIONS) config: JwtOptions, public jwtHelper: JwtHelperService) {
    this.tokenGetter = config.tokenGetter;
    this.headerName = config.headerName || 'Authorization';
    this.authScheme = config.authScheme || config.authScheme === '' ? config.authScheme : 'Bearer ';
    this.whitelistedDomains = config.whitelistedDomains || [];
    this.blacklistedRoutes = config.blacklistedRoutes || [];
    this.throwNoTokenError = config.throwNoTokenError || false;
    this.skipWhenExpired = config.skipWhenExpired || false;
  }

  isWhitelistedDomain(request: HttpRequest<any>): boolean {
    const requestUrl = new URLParse(request.url);

    return (
      requestUrl.host === null ||
      this.whitelistedDomains.findIndex(domain => {
        if (typeof domain === 'string') {
          return domain === requestUrl.host;
        }
        return domain instanceof RegExp ? domain.test(requestUrl.host) : false;
      }) > -1
    );
  }

  isBlacklistedRoute(request: HttpRequest<any>): boolean {
    const url = request.url;

    return (
      this.blacklistedRoutes.findIndex(route => {
        if (typeof route === 'string') {
          return route === url;
        }
        return route instanceof RegExp ? route.test(url) : false;
      }) > -1
    );
  }

  handleInterception(token: string | null, request: HttpRequest<any>, next: HttpHandler) {
    let tokenIsExpired = false;

    if (!token && this.throwNoTokenError) {
      throw new Error('Could not get token from tokenGetter function.');
    }

    if (this.skipWhenExpired) {
      tokenIsExpired = token ? this.jwtHelper.isTokenExpired(token) : true;
    }

    if (token && tokenIsExpired && this.skipWhenExpired) {
      request = request.clone();
    } else if (token && this.isWhitelistedDomain(request) && !this.isBlacklistedRoute(request)) {
      request = request.clone({setHeaders: {[this.headerName]: `${this.authScheme}${token}`}});
    }
    return next.handle(request);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenGetter ? this.tokenGetter() : null;

    return this.handleInterception(token, request, next);
  }
}
