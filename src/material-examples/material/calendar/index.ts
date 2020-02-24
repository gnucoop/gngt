import {CalendarModule} from '@gngt/material/calendar';
import {NgModule} from '@angular/core';

import {CalendarSimpleExample} from './calendar-simple/calendar-simple-example';

export {
  CalendarSimpleExample
};

const EXAMPLES = [
  CalendarSimpleExample
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
