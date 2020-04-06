import {Routes} from '@angular/router';
import {IonicCalendarE2E} from '../ion-calendar/calendar-e2e';
import {MaterialCalendarE2E} from '../mat-calendar/calendar-e2e';
import {Home} from './e2e-app-layout';

export const E2E_APP_ROUTES: Routes = [
  {path: '', component: Home},
  {path: 'ion-calendar', component: IonicCalendarE2E},
  {path: 'mat-calendar', component: MaterialCalendarE2E},
];
