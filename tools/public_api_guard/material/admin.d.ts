export declare class AdminDeleteConfirmDialogComponent {
    static ɵcmp: i0.ɵɵComponentDeclaration<AdminDeleteConfirmDialogComponent, "gngt-admin-delete-confirm", never, {}, {}, never, never>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AdminDeleteConfirmDialogComponent, never>;
}

export declare class AdminEditComponent<T extends Model = Model, S extends ModelState<T> = ModelState<T>, A extends ModelActionTypes = ModelActionTypes> extends BaseAdminEditComponent<T, S, A> {
    constructor(cdr: ChangeDetectorRef, fb: FormBuilder, router: Router);
    static ngAcceptInputType_canSave: BooleanInput;
    static ngAcceptInputType_hideSaveButton: BooleanInput;
    static ngAcceptInputType_readonly: BooleanInput;
    static ɵcmp: i0.ɵɵComponentDeclaration<AdminEditComponent<any, any, any>, "gngt-admin-edit", never, {}, {}, never, ["[gngtAdminEditFormHeader]", "[gngtAdminEditFormFooter]"]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AdminEditComponent<any, any, any>, never>;
}

export declare class AdminListCellDirective {
    column: string;
    readonly templateRef: TemplateRef<any>;
    constructor(templateRef: TemplateRef<any>);
    static ɵdir: i0.ɵɵDirectiveDeclaration<AdminListCellDirective, "[gngtAdminListCell]", never, { "column": "gngtAdminListCell"; }, {}, never>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AdminListCellDirective, never>;
}

export declare class AdminListComponent<T extends Model = Model, S extends ModelState<T> = ModelState<T>, A extends ModelActionTypes = ModelActionTypes, MS extends ModelService<T, S, A> = ModelService<T, S, A>> extends BaseAdminListComponent<T, S, A, MS> implements AfterContentInit, OnDestroy, OnInit {
    actionSel: MatSelect;
    cellTemplates: QueryList<AdminListCellDirective>;
    get cellTemplatesMap(): {
        [column: string]: TemplateRef<any>;
    };
    get dataSource(): ModelDataSource<T, S, A, MS>;
    set dataSource(dataSource: ModelDataSource<T, S, A, MS>);
    paginatorCmp: MatPaginator;
    readonly selection: SelectionModel<T>;
    sortCmp: MatSort;
    constructor(cdr: ChangeDetectorRef, aui: AdminUserInteractionsService);
    clearSelection(): void;
    getItems(): T[];
    getSelection(): T[];
    ngAfterContentInit(): void;
    ngOnInit(): void;
    refreshList(): void;
    selectAll(): void;
    static ɵcmp: i0.ɵɵComponentDeclaration<AdminListComponent<any, any, any, any>, "gngt-admin-list", never, { "dataSource": "dataSource"; }, {}, ["cellTemplates"], never>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AdminListComponent<any, any, any, any>, never>;
}

export declare class AdminModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<AdminModule, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<AdminModule>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<AdminModule, [typeof i1.AdminDeleteConfirmDialogComponent, typeof i2.AdminEditComponent, typeof i3.AdminListCellDirective, typeof i4.AdminListComponent], [typeof i5.CommonModule, typeof i6.GngtAdminModule, typeof i7.CommonModule, typeof i8.MatAutocompleteModule, typeof i9.MatButtonModule, typeof i10.MatCardModule, typeof i11.MatCheckboxModule, typeof i12.MatDialogModule, typeof i13.MatFormFieldModule, typeof i14.MatIconModule, typeof i15.MatInputModule, typeof i16.MatPaginatorModule, typeof i17.MatProgressBarModule, typeof i18.MatRadioModule, typeof i19.MatSelectModule, typeof i20.MatSortModule, typeof i21.MatTableModule, typeof i22.MatToolbarModule, typeof i23.ReactiveFormsModule, typeof i24.RouterModule, typeof i25.TranslateModule], [typeof i2.AdminEditComponent, typeof i3.AdminListCellDirective, typeof i4.AdminListComponent]>;
}

export declare class AdminUserInteractionsService extends CoreAdminUserInteractionsService {
    constructor(_dialog: MatDialog);
    askDeleteConfirm(): Observable<boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AdminUserInteractionsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AdminUserInteractionsService>;
}
