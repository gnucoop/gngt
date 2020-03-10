export declare class AdminEditComponent<T extends Model = Model, S extends ModelState<T> = ModelState<T>, A extends ModelActionTypes = ModelActionTypes> extends BaseAdminEditComponent<T, S, A> {
    constructor(cdr: ChangeDetectorRef, fb: FormBuilder, router: Router);
    static ngAcceptInputType_canSave: BooleanInput;
    static ngAcceptInputType_hideSaveButton: BooleanInput;
    static ngAcceptInputType_readonly: BooleanInput;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<AdminEditComponent<any, any, any>, "gngt-admin-edit", never, {}, {}, never>;
    static ɵfac: i0.ɵɵFactoryDef<AdminEditComponent<any, any, any>>;
}

export declare class AdminListComponent<T extends Model = Model, S extends ModelState<T> = ModelState<T>, A extends ModelActionTypes = ModelActionTypes, MS extends ModelService<T, S, A> = ModelService<T, S, A>> extends BaseAdminListComponent<T, S, A, MS> implements OnDestroy, OnInit {
    baseQueryParams: Partial<ModelQueryParams>;
    get hasMore(): boolean;
    infiniteScroll: IonInfiniteScroll;
    get items(): T[];
    constructor(cdr: ChangeDetectorRef, aui: AdminUserInteractionsService);
    clearSelection(): void;
    getItems(): T[];
    getSelection(): T[];
    loadMore(): void;
    ngOnDestroy(): void;
    ngOnInit(): void;
    refreshList(): void;
    selectAll(): void;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<AdminListComponent<any, any, any, any>, "gngt-admin-list", never, { "baseQueryParams": "baseQueryParams"; }, {}, never>;
    static ɵfac: i0.ɵɵFactoryDef<AdminListComponent<any, any, any, any>>;
}

export declare class AdminModule {
    static ɵinj: i0.ɵɵInjectorDef<AdminModule>;
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<AdminModule, [typeof i1.AdminEditComponent, typeof i2.AdminListComponent, typeof i3.InputTypePipe], [typeof i4.CommonModule, typeof i5.GngtAdminModule, typeof i6.GicModule, typeof i7.CommonModule, typeof i8.IonicModule, typeof i9.ReactiveFormsModule, typeof i10.RouterModule, typeof i11.TranslateModule], [typeof i1.AdminEditComponent, typeof i2.AdminListComponent]>;
}

export declare class AdminUserInteractionsService extends CoreAdminUserInteractionsService {
    constructor(_alert: AlertController, _ts: TranslateService);
    askDeleteConfirm(): Observable<boolean>;
    static ɵfac: i0.ɵɵFactoryDef<AdminUserInteractionsService>;
    static ɵprov: i0.ɵɵInjectableDef<AdminUserInteractionsService>;
}