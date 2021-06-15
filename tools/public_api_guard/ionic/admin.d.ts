export declare class AdminEditComponent<T extends Model = Model, S extends ModelState<T> = ModelState<T>, A extends ModelActionTypes = ModelActionTypes> extends BaseAdminEditComponent<T, S, A> {
    constructor(cdr: ChangeDetectorRef, fb: FormBuilder, router: Router);
    static ngAcceptInputType_canSave: BooleanInput;
    static ngAcceptInputType_hideSaveButton: BooleanInput;
    static ngAcceptInputType_readonly: BooleanInput;
    static ɵcmp: i0.ɵɵComponentDeclaration<AdminEditComponent<any, any, any>, "gngt-admin-edit", never, {}, {}, never, ["[gngtAdminEditFormHeader]", "[gngtAdminEditFormFooter]"]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AdminEditComponent<any, any, any>, never>;
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
    static ɵcmp: i0.ɵɵComponentDeclaration<AdminListComponent<any, any, any, any>, "gngt-admin-list", never, { "baseQueryParams": "baseQueryParams"; }, {}, never, never>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AdminListComponent<any, any, any, any>, never>;
}

export declare class AdminModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<AdminModule, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<AdminModule>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<AdminModule, [typeof i1.AdminEditComponent, typeof i2.AdminListComponent, typeof i3.InputTypePipe], [typeof i4.CommonModule, typeof i5.GngtAdminModule, typeof i6.GicModule, typeof i7.CommonModule, typeof i8.IonicModule, typeof i9.ReactiveFormsModule, typeof i10.RouterModule, typeof i11.TranslateModule], [typeof i1.AdminEditComponent, typeof i2.AdminListComponent]>;
}

export declare class AdminUserInteractionsService extends CoreAdminUserInteractionsService {
    constructor(_alert: AlertController, _ts: TranslateService);
    askDeleteConfirm(): Observable<boolean>;
    static ɵfac: i0.ɵɵFactoryDeclaration<AdminUserInteractionsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AdminUserInteractionsService>;
}
