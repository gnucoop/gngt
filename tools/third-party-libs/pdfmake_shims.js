// pdfmake/build/pdfmake
(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    define('pdfmake/build/pdfmake', ['exports', 'pdfmake'], factory);
  }
})(function (exports, pdfmake) {
  'use strict';
  Object.keys(pdfmake).forEach(function (key) {
    exports[key] = pdfmake[key];
  });
  Object.defineProperty(exports, '__esModule', {value: true});
});
