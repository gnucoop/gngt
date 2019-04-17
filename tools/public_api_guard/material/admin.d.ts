export declare class AdminEditComponent<T extends Model, S extends fromModel.State<T>, A1 extends ModelActions.ModelGetAction, A2 extends ModelActions.ModelListAction, A3 extends ModelActions.ModelCreateAction<T>, A4 extends ModelActions.ModelUpdateAction<T>, A5 extends ModelActions.ModelPatchAction<T>, A6 extends ModelActions.ModelDeleteAction<T>, A7 extends ModelActions.ModelDeleteAllAction<T>, A8 extends ModelActions.ModelQueryAction> extends BaseAdminEditComponent<T, S, A1, A2, A3, A4, A5, A6, A7, A8> {
    constructor(cdr: ChangeDetectorRef, fb: FormBuilder, router: Router);
}

export declare class AdminListComponent<T extends Model, S extends fromModel.State<T>, A1 extends ModelActions.ModelGetAction, A2 extends ModelActions.ModelListAction, A3 extends ModelActions.ModelCreateAction<T>, A4 extends ModelActions.ModelUpdateAction<T>, A5 extends ModelActions.ModelPatchAction<T>, A6 extends ModelActions.ModelDeleteAction<T>, A7 extends ModelActions.ModelDeleteAllAction<T>, A8 extends ModelActions.ModelQueryAction, MS extends ModelService<T, S, A1, A2, A3, A4, A5, A6, A7, A8>> extends BaseAdminListComponent<T, S, A1, A2, A3, A4, A5, A6, A7, A8, MS> implements AfterContentInit, OnDestroy, OnInit {
    actionSel: MatSelect;
    cellTemplates: QueryList<AdminListCellDirective>;
    readonly cellTemplatesMap: {
        [column: string]: TemplateRef<any>;
    };
    dataSource: ModelDataSource<T, S, A1, A2, A3, A4, A5, A6, A7, A8, MS>;
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
    constructor(dialog: MatDialog);
    askDeleteConfirm(): Observable<boolean>;
}
