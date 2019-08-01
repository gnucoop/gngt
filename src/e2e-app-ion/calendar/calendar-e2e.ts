import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'calendar-e2e',
  templateUrl: 'calendar-e2e.html',
})
export class CalendarE2E {
  isDisabled: boolean = false;
  clickCounter: number = 0;
}
