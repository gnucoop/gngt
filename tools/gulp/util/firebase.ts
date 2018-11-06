import {initializeApp} from 'firebase';

// This import lacks type definitions.
const firebaseAdmin = require('firebase-admin');

/** Database URL of the dashboard firebase project. */
const dashboardDatabaseUrl = 'https://gngt-board.firebaseio.com';

/** Opens a connection to the Firebase dashboard app using a service account. */
export function openFirebaseDashboardApp() {
  // Initialize the Firebase application with firebaseAdmin credentials.
  // Credentials need to be for a Service Account, which can be created in the Firebase console.
  return firebaseAdmin.initializeApp({
    databaseURL: dashboardDatabaseUrl,
    credential: firebaseAdmin.credential.cert({
      project_id: 'gngt-board',
      client_email: 'gngt-board@appspot.gserviceaccount.com',
      // In Travis CI the private key will be incorrect because the line-breaks are escaped.
      // The line-breaks need to persist in the service account private key.
      private_key: decode(process.env['GNGT_BOARD_FIREBASE_SERVICE_KEY']!)
    }),
  });
}

/** Opens a connection to the Firebase dashboard app with no authentication. */
export function openFirebaseDashboardAppAsGuest() {
  return initializeApp({ databaseURL: dashboardDatabaseUrl });
}

/** Decodes a Travis CI variable that is public in favor for PRs. */
export function decode(str: string): string {
  // In Travis CI the private key will be incorrect because the line-breaks are escaped.
  // The line-breaks need to persist in the service account private key.
  return (str || '').replace(/\\n/g, '\n');
}

