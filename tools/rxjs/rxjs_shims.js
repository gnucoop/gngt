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

// rxjs/operators
(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    define('rxjs/operators', ['exports', 'rxjs'], factory);
  }
})(function (exports, rxjs) {
  'use strict';
  Object.keys(rxjs.operators).forEach(function (key) {
    exports[key] = rxjs.operators[key];
  });
  Object.defineProperty(exports, '__esModule', {value: true});
});

// rxjs/testing
(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    define('rxjs/testing', ['exports', 'rxjs'], factory);
  }
})(function (exports, rxjs) {
  'use strict';
  Object.keys(rxjs.testing).forEach(function (key) {
    exports[key] = rxjs.testing[key];
  });
  Object.defineProperty(exports, '__esModule', {value: true});
});
