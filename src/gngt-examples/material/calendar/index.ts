import {NgModule} from '@angular/core';
import {CalendarModule} from '@gngt/material/calendar';

import {MaterialCalendarSimpleExample} from './calendar-simple/calendar-simple-example';

export {MaterialCalendarSimpleExample};

const EXAMPLES = [MaterialCalendarSimpleExample];

@NgModule({
  imports: [
    CalendarModule,
  ],
  declarations: EXAMPLES,
  exports: EXAMPLES,
})
export class CalendarExamplesModule {
}
