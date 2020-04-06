import {CalendarModule} from '@gngt/ionic/calendar';
import {NgModule} from '@angular/core';

import {IonicCalendarSimpleExample} from './calendar-simple/calendar-simple-example';

export {
  IonicCalendarSimpleExample
};

const EXAMPLES = [
  IonicCalendarSimpleExample
];

@NgModule({
  imports: [
    CalendarModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class CalendarExamplesModule {
}
