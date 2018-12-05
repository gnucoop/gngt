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

import {
  AfterContentInit, ChangeDetectorRef, EventEmitter, forwardRef, OnInit
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {Observable} from 'rxjs';

import {
  addDays, addMonths, addWeeks, addYears, endOfDay, endOfISOWeek, endOfMonth, endOfWeek, endOfYear,
  format, isAfter, isBefore, isSameDay, parse, setISODay, startOfDay, startOfISOWeek,
  startOfMonth, startOfWeek, startOfYear, subMonths, subWeeks, subYears
} from 'date-fns';


export const CALENDAR_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => Calendar),
  multi: true
};

const weekDays: string[] = [
  '', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

export type CalendarViewMode = ('month' | 'year' | 'decade');
export type CalendarPeriodType = ('day' | 'week' | 'month' | 'year');
export type CalendarEntryType = ('day' | 'month' | 'year');
export type CalendarWeekDay = (
  'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
);
export type CalendarEntrySelectedState = ('none' | 'partial' | 'full');

export class CalendarPeriod {
  type: CalendarPeriodType;
  startDate: Date;
  endDate: Date;
}

export class CalendarChange {
  source: Calendar;
  period: CalendarPeriod | null;
}

export class CalendarEntry {
  type: CalendarEntryType;
  date: Date;
  selected: CalendarEntrySelectedState;
  disabled = false;
  highlight = false;

  constructor(params: {
    type: CalendarEntryType,
    date: Date,
    selected: CalendarEntrySelectedState,
    highlight?: boolean,
    disabled?: boolean
  }) {
    let keys = Object.keys(params);

    this.type = params.type;
    this.date = params.date;
    this.selected = params.selected;
    if (keys.indexOf('disabled') > -1) {
      this.disabled = params.disabled!;
    }
    if (keys.indexOf('highlight') > -1) {
      this.highlight = params.highlight!;
    }
  }

  toString(): string {
    if (this.type === 'day') {
      return `${this.date.getDate()}`;
    }
    if (this.type === 'month') {
      return format(this.date, 'MMM');
    }
    return `${this.date.getFullYear()}`;
  }

  getRange(): { start: Date, end: Date } {
    if (this.type === 'day') {
      return { start: new Date(this.date), end: new Date(this.date) };
    } else {
      let curDate: Date = new Date(this.date);
      return {
        start: this.type === 'month' ? startOfMonth(curDate) : startOfYear(curDate),
        end: this.type === 'month' ? endOfMonth(curDate) : endOfYear(curDate)
      };
    }
  }
}

export abstract class Calendar implements AfterContentInit, ControlValueAccessor, OnInit {
  get viewDate(): Date { return this._viewDate; }
  set viewDate(viewDate: Date) { this._setViewDate(viewDate); }

  private _disabled = false;
  get disabled(): boolean { return this._disabled; }
  set disabled(disabled: boolean) {
    const newDisabled = disabled != null && `${disabled}` !== 'false';
    if (newDisabled !== this._disabled) {
      this._disabled = newDisabled;
      this._cdr.markForCheck();
    }
  }

  private _dateOnlyForDay = false;
  get dateOnlyForDay(): boolean { return this._disabled; }
  set dateOnlyForDay(dateOnlyForDay: boolean) {
    this._dateOnlyForDay = dateOnlyForDay != null && `${dateOnlyForDay}` !== 'false';
  }

  private _viewMode: CalendarViewMode = 'month';
  get viewMode(): CalendarViewMode { return this._viewMode; }
  set viewMode(viewMode: CalendarViewMode) {
    this._viewMode = viewMode;
    this._buildCalendar();
  }

  private _selectionMode: CalendarPeriodType = 'day';
  get selectionMode(): CalendarPeriodType { return this._selectionMode; }
  set selectionMode(selectionMode: CalendarPeriodType) {
    this._selectionMode = selectionMode;
  }

  private _startOfWeekDay = 1;
  get startOfWeekDay(): CalendarWeekDay {
    return <CalendarWeekDay>weekDays[this._startOfWeekDay];
  }
  set startOfWeekDay(weekDay: CalendarWeekDay) {
    this._startOfWeekDay = weekDays.indexOf(weekDay);

    if (this._viewMode === 'month') {
      this._buildCalendar();
    }
  }

  private _isoMode: boolean = false;

  get isoMode(): boolean { return this._isoMode; }
  set isoMode(isoMode: boolean) { this._isoMode = isoMode; }

  private _minDate: Date | null;
  get minDate(): Date | null { return this._minDate; }
  set minDate(minDate: Date | null) {
    this._minDate = minDate != null ? new Date(minDate.valueOf()) : null;
  }

  private _maxDate: Date | null;
  get maxDate(): Date | null { return this._maxDate; }
  set maxDate(maxDate: Date | null) {
    this._maxDate = maxDate != null ? new Date(maxDate.valueOf()) : null;
  }

  private _change: EventEmitter<CalendarChange> = new EventEmitter<CalendarChange>();
  get change(): Observable<CalendarChange> {
    return this._change.asObservable();
  }

  private _selectedPeriod: CalendarPeriod | null;
  private set selectedPeriod(period: CalendarPeriod | null) {
    this._selectedPeriod = period;
    this._change.emit({
      source: this,
      period: period
    });
    this._refreshSelection();
  }

  get value(): CalendarPeriod | Date | null {
    if (this._dateOnlyForDay && this.selectionMode === 'day') {
      return this._selectedPeriod != null ? this._selectedPeriod.startDate : null;
    }
    return this._selectedPeriod;
  }
  set value(period: CalendarPeriod | Date | null) {
    if (this._dateOnlyForDay && this.selectionMode === 'day') {
      if (period instanceof Date &&
        (this._selectedPeriod == null || period !== this._selectedPeriod.startDate)) {
        this.selectedPeriod = {
          type: 'day',
          startDate: period,
          endDate: period
        };
        this._onChangeCallback(period);
      }
    } else if (period instanceof Object && period !== this._selectedPeriod) {
      this.selectedPeriod = <CalendarPeriod>period;
      this._onChangeCallback(period);
    }
  }

  get calendarRows(): CalendarEntry[][] { return this._calendarRows; }
  get viewHeader(): string { return this._viewHeader; }
  get weekDays(): string[] { return this._weekDays; }

  private _viewDate: Date = new Date();
  private _viewHeader = '';

  private _calendarRows: CalendarEntry[][] = [];
  private _weekDays: string[] = [];

  constructor(private _cdr: ChangeDetectorRef) { }

  prevPage(): void {
    if (this._viewMode == 'month') {
      this.viewDate = subMonths(this.viewDate, 1);
    } else if (this._viewMode == 'year') {
      this.viewDate = subYears(this.viewDate, 1);
    }
    this._buildCalendar();
  }

  nextPage(): void {
    if (this._viewMode == 'month') {
      this.viewDate = addMonths(this.viewDate, 1);
    } else if (this._viewMode == 'year') {
      this.viewDate = addYears(this.viewDate, 1);
    }
    this._buildCalendar();
  }

  previousViewMode(): void {
    if (this._viewMode == 'decade') {
      return;
    } else if (this._viewMode == 'year') {
      this._viewMode = 'decade';
    } else if (this._viewMode == 'month') {
      this._viewMode = 'year';
    }
    this._buildCalendar();
  }

  selectEntry(entry: CalendarEntry): void {
    if (!this._canSelectEntry(entry)) {
      return this._nextViewMode(entry);
    }

    let newPeriod: CalendarPeriod | null = null;
    if (this._isEntrySelected(entry) == 'full') {
      newPeriod = null;
    } else if (this._selectionMode == 'day') {
      newPeriod = {
        type: 'day',
        startDate: entry.date,
        endDate: entry.date
      };
    } else if (this._selectionMode == 'week') {
      newPeriod = {
        type: 'week',
        startDate: this._isoMode ?
          startOfISOWeek(entry.date) :
          startOfWeek(entry.date, {weekStartsOn: this._startOfWeekDay}),
        endDate: this._isoMode ?
          endOfISOWeek(entry.date) :
          endOfWeek(entry.date, {weekStartsOn: this._startOfWeekDay})
      };
    } else if (this._selectionMode == 'month') {
      const monthBounds = this._getMonthStartEnd(entry.date);
      newPeriod = {
        type: 'month',
        startDate: new Date(monthBounds.start),
        endDate: new Date(monthBounds.end)
      };
    } else if (this._selectionMode == 'year') {
      newPeriod = {
        type: 'year',
        startDate: startOfYear(entry.date),
        endDate: endOfYear(entry.date)
      };
    }
    this.value = newPeriod;

    this._cdr.markForCheck();
  }

  registerOnChange(fn: (value: any) => void) {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }

  writeValue(value: any) {
    if (typeof value === 'string') {
      value = parse(value);
    }
    this.value = value;
  }

  ngOnInit(): void {
    this._buildCalendar();
  }

  ngAfterContentInit(): void {
    this._refreshSelection();
  }

  private _onChangeCallback: (_: any) => void = (_: any) => { };

  private _setViewDate(date: Date): void {
    this._viewDate = date;
  }

  private _getMonthStartEnd(date: Date): { start: Date, end: Date } {
    let startDate = startOfMonth(date);
    let endDate = endOfMonth(date);
    if (this._isoMode) {
      const startWeekDay = startDate.getDay();
      const endWeekDay = endDate.getDay();
      if (startWeekDay == 0 || startWeekDay > 4) {
        startDate = addWeeks(startDate, 1);
      }
      if (endWeekDay > 0 && endWeekDay < 4) {
        endDate = subWeeks(endDate, 1);
      }
      startDate = startOfISOWeek(startDate);
      endDate = endOfISOWeek(endDate);
    }
    return { start: startDate, end: endDate };
  }

  private _buildCalendar(): void {
    if (this._viewMode == 'month') {
      this._buildMonthView();
    } else if (this._viewMode == 'year') {
      this._buildYearView();
    } else if (this._viewMode == 'decade') {
      this._buildDecadeView();
    }
    this._cdr.markForCheck();
  }

  private _buildDecadeView(): void {
    let curYear: number = this._viewDate.getFullYear();
    let firstYear = curYear - (curYear % 10) + 1;
    let lastYear = firstYear + 11;

    this._viewHeader = `${firstYear} - ${lastYear}`;

    let curDate: Date = startOfYear(this._viewDate);
    curDate.setFullYear(firstYear);

    let rows: CalendarEntry[][] = [];
    for (let i = 0; i < 4; i++) {
      let row: CalendarEntry[] = [];
      for (let j = 0; j < 3; j++) {
        let date = new Date(curDate);
        let newEntry = new CalendarEntry({
          type: 'year',
          date: date,
          selected: 'none'
        });
        newEntry.selected = this._isEntrySelected(newEntry);
        row.push(newEntry);
        curDate = addYears(curDate, 1);
      }
      rows.push(row);
    }
    this._calendarRows = rows;
  }

  private _buildYearView(): void {
    this._viewHeader = `${this._viewDate.getFullYear()}`;

    let curDate: Date = startOfYear(this._viewDate);

    let rows: CalendarEntry[][] = [];
    for (let i = 0; i < 4; i++) {
      let row: CalendarEntry[] = [];
      for (let j = 0; j < 3; j++) {
        let date = new Date(curDate);
        let newEntry = new CalendarEntry({
          type: 'month',
          date: date,
          selected: 'none'
        });
        newEntry.selected = this._isEntrySelected(newEntry);
        row.push(newEntry);
        curDate = addMonths(curDate, 1);
      }
      rows.push(row);
    }
    this._calendarRows = rows;
  }

  private _buildMonthView(): void {
    this._viewHeader = format(this._viewDate, 'MMM YYYY');

    this._buildMonthViewWeekDays();
    const monthBounds = this._getMonthStartEnd(this._viewDate);
    let viewStartDate: Date = new Date(monthBounds.start);
    let viewEndDate: Date = new Date(monthBounds.end);
    if (!this._isoMode) {
      viewStartDate = startOfWeek(viewStartDate);
      viewEndDate = endOfWeek(viewEndDate);
    }

    let rows: CalendarEntry[][] = [];
    let todayDate = new Date();
    let curDate = new Date(viewStartDate);
    let minDate = this.minDate == null ? null : new Date(this.minDate);
    let maxDate = this.maxDate == null ? null : new Date(this.maxDate);
    while (curDate < viewEndDate) {
      let row: CalendarEntry[] = [];
      for (let i = 0; i < 7; i++) {
        let disabled = (minDate != null && isBefore(curDate, minDate)) ||
          (maxDate != null && isAfter(curDate, maxDate));
        let date = new Date(curDate);
        let newEntry: CalendarEntry = new CalendarEntry({
          type: 'day',
          date: date,
          selected: 'none',
          highlight: format(todayDate, 'YYYY-MM-DD') === format(curDate, 'YYYY-MM-DD'),
          disabled: disabled
        });
        newEntry.selected = this._isEntrySelected(newEntry);
        row.push(newEntry);
        curDate = addDays(curDate, 1);
      }
      rows.push(row);
    }

    this._calendarRows = rows;
  }

  private _buildMonthViewWeekDays(): void {
    let curDate: Date;
    if (this._isoMode) {
      curDate = setISODay(startOfWeek(this._viewDate), 1);
    } else {
      curDate = startOfWeek(this._viewDate);
    }
    let weekDayNames: string[] = [];
    for (let i = 0; i < 7; i++) {
      weekDayNames.push(format(curDate, 'dddd'));
      curDate = addDays(curDate, 1);
    }
    this._weekDays = weekDayNames;
    this._cdr.markForCheck();
  }

  private _periodOrder(entryType: CalendarPeriodType): number {
    return ['day', 'week', 'month', 'year'].indexOf(entryType);
  }

  private _isEntrySelected(entry: CalendarEntry): CalendarEntrySelectedState {
    if (
      this._selectedPeriod != null && this._selectedPeriod.startDate != null &&
      this._selectedPeriod.endDate != null
    ) {
      let selectionStart: Date = startOfDay(this._selectedPeriod.startDate);
      let selectionEnd: Date = endOfDay(this._selectedPeriod.endDate);
      let selectionPeriodOrder: number = this._periodOrder(this._selectedPeriod.type);

      let entryPeriodOrder: number = this._periodOrder(entry.type);
      let entryRange: { start: Date, end: Date } = entry.getRange();

      if (entryPeriodOrder <= selectionPeriodOrder &&
        this._isBetween(entryRange.start, selectionStart, selectionEnd) &&
        this._isBetween(entryRange.end, selectionStart, selectionEnd)
      ) {
        return 'full';
      } else if (entryPeriodOrder > selectionPeriodOrder &&
        this._isBetween(selectionStart, entryRange.start, entryRange.end) &&
        this._isBetween(selectionEnd, entryRange.start, entryRange.end)
      ) {
        return 'partial';
      }
    }

    return 'none';
  }

  private _isBetween(date: Date, rangeLeft: Date, rangeRight: Date): boolean {
    return (isAfter(date, rangeLeft) || isSameDay(date, rangeLeft))
      && (isBefore(date, rangeRight) || isSameDay(date, rangeRight));
  }

  private _refreshSelection(): void {
    for (let row of this._calendarRows) {
      for (let entry of row) {
        entry.selected = this._isEntrySelected(entry);
      }
    }
  }

  private _canSelectEntry(entry: CalendarEntry): boolean {
    if (['day', 'week'].indexOf(this._selectionMode) >= 0 && entry.type != 'day') {
      return false;
    }
    if (this._selectionMode == 'month' && entry.type == 'year') {
      return false;
    }
    return true;
  }

  private _nextViewMode(entry: CalendarEntry): void {
    if (this._viewMode == 'decade') {
      this._viewMode = 'year';
    } else if (this._viewMode == 'year') {
      this._viewMode = 'month';
    } else if (this._viewMode == 'month') {
      return;
    }
    this._viewDate = entry.date;
    this._buildCalendar();
  }
}
