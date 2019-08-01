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

import {Routes} from '@angular/router';
import {DevApp404} from './dev-app-404';
import {DevAppHome} from './dev-app-home';

export const DEV_APP_ROUTES: Routes = [
  {path: '', component: DevAppHome},
  {path: 'calendar', loadChildren: 'calendar/calendar-demo-module#CalendarDemoModule'},
  {
    path: 'checkbox-group',
    loadChildren: 'checkbox-group/checkbox-group-demo-module#CheckboxGroupDemoModule'
  },
  {
    path: 'form-builder',
    loadChildren: 'form-builder/form-builder-demo-module#FormBuilderDemoModule'
  },
  {path: 'forms', loadChildren: 'forms/forms-demo-module#FormsDemoModule'},
  {path: 'image', loadChildren: 'image/image-demo-module#ImageDemoModule'},
  {path: 'node-icon', loadChildren: 'node-icon/node-icon-demo-module#NodeIconDemoModule'},
  {path: 'page-slider', loadChildren: 'page-slider/page-slider-demo-module#PageSliderDemoModule'},
  {
    path: 'report-builder',
    loadChildren: 'report-builder/report-builder-demo-module#ReportBuilderDemoModule'
  },
  {path: 'reports', loadChildren: 'reports/reports-demo-module#ReportsDemoModule'},
  {path: 'time', loadChildren: 'time/time-demo-module#TimeDemoModule'},
  {path: 'examples', loadChildren: 'examples-page/examples-page-module#ExamplesPageModule'},
  {path: '**', component: DevApp404},
];
