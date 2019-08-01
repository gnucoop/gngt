import {Routes} from '@angular/router';
import {CalendarE2E} from '../calendar/calendar-e2e';
import {Home} from './e2e-app-layout';

export const E2E_APP_ROUTES: Routes = [
  {path: '', component: Home},
  {path: 'calendar', component: CalendarE2E},
];
