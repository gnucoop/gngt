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

// Workaround for an issue where RxJS cannot be used with UMD bundles only. This is because
// rxjs only ships one UMD bundle and expects everyone to only use the named "rxjs" AMD module.
// Since our code internally loads operators from "rxjs/operators/index", we need to make sure
// that we re-export all operators from the UMD module. This is a small trade-off for not loading
// all rxjs files individually.

declare const define: {
  (deps: string[], factory: (...deps: any[]) => void): void;
  amd: boolean;
};

if (typeof define === 'function' && define.amd) {
  define(['exports', 'rxjs'], (exports: any, rxjs: any) => {
    // Re-export all operators in this AMD module.
    Object.assign(exports, rxjs.operators);
  });
}
