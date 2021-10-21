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

import browserSync from 'browser-sync';
import http from 'http';
import path from 'path';
import send from 'send';

/**
 * Dev Server implementation that uses browser-sync internally. This dev server
 * supports Bazel runfile resolution in order to make it work in a Bazel sandbox
 * environment and on Windows (with a runfile manifest file).
 */
export class DevServer {
  /** Instance of the browser-sync server. */
  server = browserSync.create();

  /** Options of the browser-sync server. */
  options: browserSync.Options = {
    open: false,
    online: false,
    port: this.port,
    notify: false,
    ghostMode: false,
    server: {
      directory: false,
      middleware: [(req, res) => this._bazelMiddleware(req, res)],
    },
  };

  constructor(
    readonly port: number,
    private _rootPaths: string[],
    bindUi: boolean,
    private _historyApiFallback: boolean = false,
  ) {
    if (bindUi === false) {
      this.options.ui = false;
    }
  }

  /** Starts the server on the given port. */
  async start() {
    return new Promise<void>((resolve, reject) => {
      this.server.init(this.options, err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /** Reloads all browsers that currently visit a page from the server. */
  reload() {
    this.server.reload();
  }

  /**
   * Middleware function used by BrowserSync. This function is responsible for
   * Bazel runfile resolution and HTML History API support.
   */
  private _bazelMiddleware(req: http.IncomingMessage, res: http.ServerResponse) {
    if (!req.url) {
      res.statusCode = 500;
      res.end('Error: No url specified');
      return;
    }

    // Detect if the url escapes the server's root path
    for (const rootPath of this._rootPaths) {
      const absoluteRootPath = path.resolve(rootPath);
      const absoluteJoinedPath = path.resolve(path.posix.join(rootPath, getManifestPath(req.url)));
      if (!absoluteJoinedPath.startsWith(absoluteRootPath)) {
        res.statusCode = 500;
        res.end('Error: Detected directory traversal');
        return;
      }
    }

    // Implements the HTML history API fallback logic based on the requirements of the
    // "connect-history-api-fallback" package. See the conditions for a request being redirected
    // to the index: https://github.com/bripkens/connect-history-api-fallback#introduction
    if (
      this._historyApiFallback &&
      req.method === 'GET' &&
      !req.url.includes('.') &&
      req.headers.accept &&
      req.headers.accept.includes('text/html')
    ) {
      req.url = '/index.html';
    }

    const resolvedPath = this._resolveUrlFromRunfiles(req.url);

    if (resolvedPath === null) {
      res.statusCode = 404;
      res.end('Page not found');
      return;
    }

    send(req, resolvedPath).pipe(res);
  }

  /** Resolves a given URL from the runfiles using the corresponding manifest path. */
  private _resolveUrlFromRunfiles(url: string): string | null {
    for (let rootPath of this._rootPaths) {
      try {
        return require.resolve(path.posix.join(rootPath, getManifestPath(url)));
      } catch {}
    }
    return null;
  }
}

/** Gets the manifest path for a given url */
function getManifestPath(url: string) {
  // Remove the leading slash from the URL. Manifest paths never
  // start with a leading slash.
  return url.substring(1);
}
