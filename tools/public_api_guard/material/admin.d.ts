export declare class AdminDeleteConfirmDialogComponent {
}

export declare class AdminEditComponent<T extends Model, S extends fromModel.State<T>, A extends ModelActions.ModelActionTypes> extends BaseAdminEditComponent<T, S, A> {
    constructor(cdr: ChangeDetectorRef, fb: FormBuilder, router: Router);
}

export declare class AdminListComponent<T extends Model, S extends fromModel.State<T>, A extends ModelActions.ModelActionTypes, MS extends ModelService<T, S, A>> extends BaseAdminListComponent<T, S, A, MS> implements AfterContentInit, OnDestroy, OnInit {
    actionSel: MatSelect;
    cellTemplates: QueryList<AdminListCellDirective>;
    readonly cellTemplatesMap: {
        [column: string]: TemplateRef<any>;
    };
    dataSource: ModelDataSource<T, S, A, MS>;
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
}

export declare class AdminModule {
}

export declare class AdminUserInteractionsService extends CoreAdminUserInteractionsService {
    constructor(_dialog: MatDialog);
    askDeleteConfirm(): Observable<boolean>;
}
