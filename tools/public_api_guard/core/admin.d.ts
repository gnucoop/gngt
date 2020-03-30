export declare abstract class AdminEditComponent<T extends Model = Model, S extends ModelState<T> = ModelState<T>, A extends ModelActionTypes = ModelActionTypes> implements OnDestroy {
    get canSave(): boolean;
    set canSave(canSave: boolean);
    get cancelLabel(): string;
    set cancelLabel(cancelLabel: string);
    get fields(): AdminEditField[];
    set fields(fields: AdminEditField[]);
    readonly form: Observable<FormGroup>;
    get hideSaveButton(): boolean;
    set hideSaveButton(hideSaveButton: boolean);
    set id(id: number | 'new');
    set listUrl(listUrl: string);
    readonly loading: Observable<boolean>;
    set postSaveHook(postSaveHook: (obj: T) => Observable<T>);
    set processFormData(processFormData: ProcessDataFn | Observable<ProcessDataFn>);
    set processObject(processObject: ProcessDataFn | Observable<ProcessDataFn>);
    get readonly(): boolean;
    set readonly(readonly: boolean);
    get saveLabel(): string;
    set saveLabel(saveLabel: string);
    set service(service: ModelService<T, S, A>);
    get title(): string;
    set title(title: string);
    get valueChanges$(): Observable<any>;
    constructor(_cdr: ChangeDetectorRef, _fb: FormBuilder, _router: Router);
    goBack(): void;
    ngOnDestroy(): void;
    save(): void;
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<AdminEditComponent<any, any, any>, never, never, { "title": "title"; "listUrl": "listUrl"; "cancelLabel": "cancelLabel"; "saveLabel": "saveLabel"; "service": "service"; "fields": "fields"; "id": "id"; "processObject": "processObject"; "processFormData": "processFormData"; "readonly": "readonly"; "hideSaveButton": "hideSaveButton"; "canSave": "canSave"; "postSaveHook": "postSaveHook"; }, { "valueChanges$": "valueChanges$"; }, never>;
    static ɵfac: i0.ɵɵFactoryDef<AdminEditComponent<any, any, any>, never>;
}

export interface AdminEditField {
    choices?: AdminEditFieldChoice[] | Observable<AdminEditFieldChoice[]>;
    hidden?: boolean;
    label: string;
    name: string;
    readonly?: boolean;
    subtype?: AdminEditFieldSubtype;
    type: AdminEditFieldType;
    validators?: ValidatorFn[];
}

export interface AdminEditFieldChoice {
    label: string;
    value: any;
}

export declare enum AdminEditFieldSubtype {
    Color = "color",
    Date = "date",
    DateTimeLocal = "datetime-local",
    Email = "email",
    Month = "month",
    Number = "number",
    Password = "password",
    Search = "search",
    Tel = "tel",
    Text = "text",
    Time = "time",
    Url = "url",
    Week = "week"
}

export declare enum AdminEditFieldType {
    Input = "input",
    TextArea = "textarea",
    CheckBox = "checkbox",
    Radio = "radio",
    Select = "select",
    MultipleSelect = "multipleselect",
    Autocomplete = "autocomplete"
}

export interface AdminEditModel<M extends Model> {
    fields: AdminEditField[];
    model: M | null;
}

export declare abstract class AdminListComponent<T extends Model = Model, S extends ModelState<T> = ModelState<T>, A extends ModelActionTypes = ModelActionTypes, MS extends ModelService<T, S, A> = ModelService<T, S, A>> implements OnDestroy {
    protected _actionProcessed: EventEmitter<string>;
    protected _cdr: ChangeDetectorRef;
    protected _service: MS;
    readonly actionProcessed: Observable<string>;
    get baseEditUrl(): string;
    set baseEditUrl(baseEditUrl: string);
    get displayedColumns(): string[];
    set displayedColumns(displayedColumns: string[]);
    get headers(): AdminListHeader[];
    set headers(headers: AdminListHeader[]);
    get newItemPath(): string;
    set newItemPath(newItemPath: string);
    set service(service: MS);
    get title(): string;
    set title(title: string);
    constructor(_cdr: ChangeDetectorRef, _aui: AdminUserInteractionsService);
    protected _getService(): MS;
    abstract clearSelection(): void;
    abstract getItems(): T[];
    abstract getSelection(): T[];
    isAllSelected(): boolean;
    masterToggle(): void;
    ngOnDestroy(): void;
    processAction(action: string): void;
    processDeleteAction(selected: T[]): void;
    abstract refreshList(): void;
    abstract selectAll(): void;
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<AdminListComponent<any, any, any, any>, never, never, { "title": "title"; "headers": "headers"; "displayedColumns": "displayedColumns"; "baseEditUrl": "baseEditUrl"; "newItemPath": "newItemPath"; "service": "service"; }, {}, never>;
    static ɵfac: i0.ɵɵFactoryDef<AdminListComponent<any, any, any, any>, never>;
}

export interface AdminListHeader {
    column: string;
    hidden?: boolean;
    label: string;
    sortable?: boolean;
}

export declare abstract class AdminUserInteractionsService {
    abstract askDeleteConfirm(): Observable<boolean>;
}

export declare class ChoicesPipe implements PipeTransform {
    constructor(cdr: ChangeDetectorRef);
    transform(value: AdminEditFieldChoice[] | Observable<AdminEditFieldChoice[]> | Promise<AdminEditFieldChoice[]> | null | undefined): AdminEditFieldChoice[];
    static ɵfac: i0.ɵɵFactoryDef<ChoicesPipe, never>;
    static ɵpipe: i0.ɵɵPipeDefWithMeta<ChoicesPipe, "gngtChoices">;
}

export declare class GngtAdminModule {
    static ɵinj: i0.ɵɵInjectorDef<GngtAdminModule>;
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<GngtAdminModule, [typeof i1.ChoicesPipe], never, [typeof i1.ChoicesPipe]>;
}

export declare type ProcessDataFn = (value: any) => void;
