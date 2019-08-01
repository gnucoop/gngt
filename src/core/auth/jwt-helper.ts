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

import {Injectable, Inject} from '@angular/core';

import {JwtOptions} from './jwt-options';
import {JwtToken} from './jwt-token';
import {JWT_OPTIONS} from './jwt-options-token';


@Injectable({providedIn: 'root'})
export class JwtHelperService {
  tokenGetter: () => string | null;
  tokenSetter: (token: string | null) => void;
  refreshTokenGetter: () => string | null;
  refreshTokenSetter: (refreshToken: string | null) => void;

  constructor(@Inject(JWT_OPTIONS) config: JwtOptions) {
    this.tokenGetter = config && config.tokenGetter ?
      config.tokenGetter : () => null;
    this.tokenSetter = config && config.tokenSetter ?
      config.tokenSetter : () => null;
    this.refreshTokenGetter = config && config.refreshTokenGetter ?
      config.refreshTokenGetter : () => null;
    this.refreshTokenSetter = config && config.refreshTokenSetter ?
      config.refreshTokenSetter : () => null;
  }

  urlBase64Decode(str: string): string {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: {
        break;
      }
      case 2: {
        output += '==';
        break;
      }
      case 3: {
        output += '=';
        break;
      }
      default: {
        throw new Error('Illegal base64url string!');
      }
    }
    return this._b64DecodeUnicode(output);
  }

  // credits for decoder goes to https://github.com/atk
  private _b64decode(str: string): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';

    str = String(str).replace(/=+$/, '');

    if (str.length % 4 === 1) {
      throw new Error(
        '\'atob\' failed: The string to be decoded is not correctly encoded.'
      );
    }

    for (
       // tslint:disable:no-bitwise
      // initialize result and counters
      let bc = 0, bs: any, buffer: any, idx = 0;
      // get next character
      (buffer = str.charAt(idx++));
      // character found in table? initialize bit storage and add its ascii value;
      ~buffer &&
      (
        (bs = bc % 4 ? bs * 64 + buffer : buffer),
        // and if not first of each 4 characters,
        // convert the first 8 bits to one ascii character
        bc++ % 4
      )
        ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
        : 0
    ) {
      // try to find character in table (0-63, not found => -1)
      buffer = chars.indexOf(buffer);
       // tslint:enable:no-bitwise
    }
    return output;
  }

  private _b64DecodeUnicode(str: any) {
    return decodeURIComponent(
      Array.prototype.map
        .call(this._b64decode(str), (c: any) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  }

  decodeToken(token: string | null = this.tokenGetter()): JwtToken | null {
    if (token === null) {
      return null;
    }

    const parts = token.split('.');

    if (parts.length !== 3) {
      throw new Error(
        'The inspected token doesn\'t appear to be a JWT. '
        + 'Check to make sure it has three parts and see https://jwt.io for more.'
      );
    }

    const decoded = this.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode the token.');
    }

    return JSON.parse(decoded);
  }

  getTokenExpirationDate(token: string | null = this.tokenGetter()): Date | null {
    let decoded: any;
    decoded = this.decodeToken(token);

    if (!decoded.hasOwnProperty('exp')) {
      return null;
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);

    return date;
  }

  isTokenExpired(token: string | null = this.tokenGetter(), offsetSeconds?: number): boolean {
    if (token === null || token === '') {
        return true;
    }
    const date = this.getTokenExpirationDate(token);
    offsetSeconds = offsetSeconds || 0;

    if (date === null) {
      return true;
    }

    return !(date.valueOf() > new Date().valueOf() + offsetSeconds * 1000);
  }
}
