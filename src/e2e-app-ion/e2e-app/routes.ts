import {Routes} from '@angular/router';
import {Home} from './e2e-app';
import {LoginE2E} from '../login/login-e2e';
// import {
// } from '@gngt/material-examples';

export const E2E_APP_ROUTES: Routes = [
  {path: '', component: Home},
  {path: 'login', component: LoginE2E},
];
