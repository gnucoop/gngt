export declare abstract class Calendar implements AfterContentInit, ControlValueAccessor, OnInit {
    get calendarRows(): CalendarEntry[][];
    get change(): Observable<CalendarChange>;
    get dateOnlyForDay(): boolean;
    set dateOnlyForDay(dateOnlyForDay: boolean);
    get disabled(): boolean;
    set disabled(disabled: boolean);
    get isoMode(): boolean;
    set isoMode(isoMode: boolean);
    get maxDate(): Date | null;
    set maxDate(maxDate: Date | null);
    get minDate(): Date | null;
    set minDate(minDate: Date | null);
    set selectedPeriod(period: CalendarPeriod | null);
    get selectionMode(): CalendarPeriodType;
    set selectionMode(selectionMode: CalendarPeriodType);
    get startOfWeekDay(): CalendarWeekDay;
    set startOfWeekDay(weekDay: CalendarWeekDay);
    get value(): CalendarPeriod | Date | null;
    set value(period: CalendarPeriod | Date | null);
    get viewDate(): Date;
    set viewDate(viewDate: Date);
    get viewHeader(): string;
    get viewMode(): CalendarViewMode;
    set viewMode(viewMode: CalendarViewMode);
    get weekDays(): string[];
    constructor(_cdr: ChangeDetectorRef);
    nextPage(): void;
    ngAfterContentInit(): void;
    ngOnInit(): void;
    prevPage(): void;
    previousViewMode(): void;
    registerOnChange(fn: (value: any) => void): void;
    registerOnTouched(fn: any): void;
    selectEntry(entry: CalendarEntry): void;
    writeValue(value: any): void;
    static ɵdir: i0.ɵɵDirectiveDeclaration<Calendar, never, never, { "viewDate": "viewDate"; "disabled": "disabled"; "dateOnlyForDay": "dateOnlyForDay"; "viewMode": "viewMode"; "selectionMode": "selectionMode"; "startOfWeekDay": "startOfWeekDay"; "isoMode": "isoMode"; "minDate": "minDate"; "maxDate": "maxDate"; "selectedPeriod": "selectedPeriod"; }, { "change": "change"; }, never>;
    static ɵfac: i0.ɵɵFactoryDeclaration<Calendar, never>;
}

export declare const CALENDAR_CONTROL_VALUE_ACCESSOR: any;

export declare class CalendarChange {
    period: CalendarPeriod | null;
    source: Calendar;
}

export declare class CalendarEntry {
    date: Date;
    disabled: boolean;
    highlight: boolean;
    selected: CalendarEntrySelectedState;
    type: CalendarEntryType;
    constructor(params: {
        type: CalendarEntryType;
        date: Date;
        selected: CalendarEntrySelectedState;
        highlight?: boolean;
        disabled?: boolean;
    });
    getRange(): {
        start: Date;
        end: Date;
    };
    toString(): string;
}

export declare type CalendarEntrySelectedState = ('none' | 'partial' | 'full');

export declare type CalendarEntryType = ('day' | 'month' | 'year');

export declare class CalendarPeriod {
    endDate: Date;
    startDate: Date;
    type: CalendarPeriodType;
}

export declare type CalendarPeriodType = ('day' | 'week' | 'month' | 'year');

export declare type CalendarViewMode = ('month' | 'year' | 'decade');

export declare type CalendarWeekDay = ('monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday');
