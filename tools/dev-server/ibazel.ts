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

import {createInterface} from 'readline';
import {DevServer} from './dev-server';

// ibazel will write this string after a successful build.
const ibazelNotifySuccessMessage = 'IBAZEL_BUILD_COMPLETED SUCCESS';

/**
 * Sets up ibazel support for the specified devserver. ibazel communicates with
 * an executable over the "stdin" interface. Whenever a specific message is sent
 * over "stdin", the devserver can be reloaded.
 */
export function setupBazelWatcherSupport(server: DevServer) {
  // If iBazel is not configured for this process, we do not setup the watcher.
  if (process.env['IBAZEL_NOTIFY_CHANGES'] !== 'y') {
    return;
  }

  // ibazel communicates via the stdin interface.
  const rl = createInterface({input: process.stdin, terminal: false});

  rl.on('line', (chunk: string) => {
    if (chunk === ibazelNotifySuccessMessage) {
      server.reload();
    }
  });

  rl.on('close', () => {
    // Give ibazel 5s to kill this process, otherwise we exit the process manually.
    setTimeout(() => {
      console.error('ibazel failed to stop the devserver after 5s.');
      process.exit(1);
    }, 5000);
  });
}
