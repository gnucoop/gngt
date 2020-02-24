export declare function createAction<A extends Action>(params: {
    type: string;
    payload?: any;
    uuid?: string;
}): A;

export declare function generateInitialModelState<M extends Model>(): State<M>;

export declare function generateModelActionTypes(typeName: string): ModelActionTypes;

export declare const MODEL_OPTIONS: InjectionToken<ModelOptions>;

export interface ModelActionTypes {
    CREATE: string;
    CREATE_FAILURE: string;
    CREATE_SUCCESS: string;
    DELETE: string;
    DELETE_ALL: string;
    DELETE_ALL_FAILURE: string;
    DELETE_ALL_SUCCESS: string;
    DELETE_FAILURE: string;
    DELETE_SUCCESS: string;
    GET: string;
    GET_FAILURE: string;
    GET_SUCCESS: string;
    LIST: string;
    LIST_FAILURE: string;
    LIST_SUCCESS: string;
    PATCH: string;
    PATCH_FAILURE: string;
    PATCH_SUCCESS: string;
    QUERY: string;
    QUERY_FAILURE: string;
    QUERY_SUCCESS: string;
    UPDATE: string;
    UPDATE_FAILURE: string;
    UPDATE_SUCCESS: string;
}

export declare abstract class ModelBaseAction implements ModelGenericAction {
    payload: any;
    abstract type: string;
    uuid: string;
    constructor(payload: any);
}

export declare abstract class ModelCreateAction<T extends Model> extends ModelBaseAction {
    payload: {
        item: T;
    };
    abstract type: string;
    constructor(payload: {
        item: T;
    });
}

export declare abstract class ModelCreateFailureAction extends ModelBaseAction {
    payload: {
        error: ModelError;
    };
    abstract type: string;
    constructor(payload: {
        error: ModelError;
    });
}

export interface ModelCreateState<M extends Model> {
    error: ModelError | null;
    loading: boolean;
    object: M | null;
    uuid: string;
}

export declare abstract class ModelCreateSuccessAction<T extends Model> extends ModelBaseAction {
    payload: {
        item: T;
    };
    abstract type: string;
    constructor(payload: {
        item: T;
    });
}

export declare abstract class ModelDeleteAction<T extends Model> extends ModelBaseAction {
    payload: {
        item: T;
    };
    abstract type: string;
    constructor(payload: {
        item: T;
    });
}

export declare abstract class ModelDeleteAllAction<T extends Model> extends ModelBaseAction {
    payload: {
        items: T[];
    };
    abstract type: string;
    constructor(payload: {
        items: T[];
    });
}

export declare abstract class ModelDeleteAllFailureAction extends ModelBaseAction {
    payload: {
        error: ModelError;
    };
    abstract type: string;
    constructor(payload: {
        error: ModelError;
    });
}

export interface ModelDeleteAllState<M extends Model> {
    error: ModelError | null;
    ids: number[] | null;
    loading: boolean;
    objects: M[] | null;
    uuid: string;
}

export declare abstract class ModelDeleteAllSuccessAction<T extends Model> extends ModelBaseAction {
    payload: {
        items: T[];
    };
    abstract type: string;
    constructor(payload: {
        items: T[];
    });
}

export declare abstract class ModelDeleteFailureAction extends ModelBaseAction {
    payload: {
        error: ModelError;
    };
    abstract type: string;
    constructor(payload: {
        error: ModelError;
    });
}

export interface ModelDeleteState<M extends Model> {
    error: ModelError | null;
    id: number | null;
    loading: boolean;
    object: M | null;
    uuid: string;
}

export declare abstract class ModelDeleteSuccessAction<T extends Model> extends ModelBaseAction {
    payload: {
        item: T;
    };
    abstract type: string;
    constructor(payload: {
        item: T;
    });
}

export declare abstract class ModelEffects<M extends Model = Model, S extends fromModel.State<M> = fromModel.State<M>, A extends Action = Action, AT extends ModelActionTypes = ModelActionTypes> {
    protected _actions: Actions;
    protected _manager: ModelManager<M>;
    protected _service: ModelService<M, S, AT>;
    protected readonly modelCreate$: Observable<A>;
    protected readonly modelDelete$: Observable<A>;
    protected readonly modelDeleteAll$: Observable<A>;
    protected readonly modelGet$: Observable<A>;
    protected readonly modelList$: Observable<A>;
    protected readonly modelPatch$: Observable<A>;
    protected readonly modelQuery$: Observable<A>;
    protected readonly modelUpdate$: Observable<A>;
    constructor(_actions: Actions, _service: ModelService<M, S, AT>, _manager: ModelManager<M>, _actionTypes: AT);
}

export interface ModelError {
    message: string;
    stack: string;
}

export declare class ModelGenericAction implements Action {
    payload: any;
    type: string;
    uuid: string;
    constructor(payload: any);
}

export declare abstract class ModelGetAction extends ModelBaseAction {
    payload: {
        id: number;
    };
    constructor(payload: {
        id: number;
    });
}

export declare abstract class ModelGetFailureAction extends ModelBaseAction {
    payload: {
        error: ModelError;
    };
    abstract type: string;
    constructor(payload: {
        error: ModelError;
    });
}

export interface ModelGetState<M extends Model> {
    error: ModelError | null;
    id: number | null;
    loading: boolean;
    object: M | null;
    options: ModelGetParams;
    uuid: string;
}

export declare abstract class ModelGetSuccessAction<T extends Model> extends ModelBaseAction {
    payload: {
        item: T;
    };
    constructor(payload: {
        item: T;
    });
}

export declare abstract class ModelListAction extends ModelBaseAction {
    payload: {
        params: ModelListParams;
    };
    abstract type: string;
    constructor(payload: {
        params: ModelListParams;
    });
}

export declare abstract class ModelListFailureAction extends ModelBaseAction {
    payload: {
        error: ModelError;
    };
    abstract type: string;
    constructor(payload: {
        error: ModelError;
    });
}

export interface ModelListState<M extends Model> {
    error: ModelError | null;
    loading: boolean;
    objects: ModelListResult<M> | null;
    options: ModelListParams;
    uuid: string;
}

export declare abstract class ModelListSuccessAction<T extends Model> extends ModelBaseAction {
    payload: {
        result: ModelListResult<T>;
    };
    abstract type: string;
    constructor(payload: {
        result: ModelListResult<T>;
    });
}

export declare abstract class ModelManager<M extends Model = Model> extends BaseModelManager {
    protected _http: HttpClient;
    get baseUrl(): string;
    get endPoint(): string;
    constructor(config: ModelOptions, _endPoint: string, _http: HttpClient, syncService?: SyncService);
    create(data: M): Observable<M>;
    delete(id: number): Observable<M>;
    deleteAll(ids: number[]): Observable<M>;
    get(id: number): Observable<M>;
    list(options?: ModelListParams): Observable<ModelListResult<M>>;
    patch(id: number, data: M): Observable<M>;
    query(params: ModelQueryParams): Observable<ModelListResult<M>>;
    update(id: number, data: M): Observable<M>;
}

export interface ModelOptions {
    addTrailingSlash?: boolean;
    baseApiUrl: string;
    syncModel?: boolean;
    tableName?: string;
}

export interface ModelPackageState<M extends Model> {
    [model: string]: State<M>;
}

export declare abstract class ModelPatchAction<T extends Model> extends ModelBaseAction {
    payload: {
        item: T;
    };
    abstract type: string;
    constructor(payload: {
        item: T;
    });
}

export declare abstract class ModelPatchFailureAction extends ModelBaseAction {
    payload: {
        error: ModelError;
    };
    abstract type: string;
    constructor(payload: {
        error: ModelError;
    });
}

export interface ModelPatchState<M extends Model> {
    error: ModelError | null;
    id: number | null;
    loading: boolean;
    object: M | null;
    uuid: string;
}

export declare abstract class ModelPatchSuccessAction<T extends Model> extends ModelBaseAction {
    payload: {
        item: T;
    };
    abstract type: string;
    constructor(payload: {
        item: T;
    });
}

export declare abstract class ModelQueryAction extends ModelBaseAction {
    payload: {
        params: ModelQueryParams;
    };
    abstract type: string;
    constructor(payload: {
        params: ModelQueryParams;
    });
}

export declare abstract class ModelQueryFailureAction extends ModelBaseAction {
    payload: {
        error: ModelError;
    };
    abstract type: string;
    constructor(payload: {
        error: ModelError;
    });
}

export interface ModelQueryState<M extends Model> {
    error: ModelError | null;
    loading: boolean;
    objects: ModelListResult<M> | null;
    options: ModelQueryParams | null;
    uuid: string;
}

export declare abstract class ModelQuerySuccessAction<T extends Model> extends ModelBaseAction {
    payload: {
        result: ModelListResult<T>;
    };
    abstract type: string;
    constructor(payload: {
        result: ModelListResult<T>;
    });
}

export declare function modelReducer<M extends Model>(state: State<M>, action: ModelBaseAction, actionTypes: ModelActionTypes): State<M>;

export declare abstract class ModelService<T extends Model = Model, S extends fromModel.State<T> = fromModel.State<T>, A extends ModelActionTypes = ModelActionTypes> {
    protected _actions: Actions<ModelGenericAction>;
    protected _modelState: MemoizedSelector<object, S>;
    protected _store: Store<fromRoot.State>;
    constructor(_store: Store<fromRoot.State>, _actions: Actions<ModelGenericAction>, _actionTypes: A, statePrefixes: [string, string]);
    create(data: Partial<T>): Observable<T>;
    delete(data: T): Observable<T>;
    deleteAll(data: T[]): Observable<T[]>;
    get(id: number): Observable<T>;
    getCreateError(): Observable<ModelError | null>;
    getCreateLoading(): Observable<boolean>;
    getCreateObject(): Observable<T | null>;
    getCreateSuccess(): Observable<ModelCreateSuccessAction<T>>;
    getDeleteAllError(): Observable<ModelError | null>;
    getDeleteAllIds(): Observable<number[] | null>;
    getDeleteAllLoading(): Observable<boolean>;
    getDeleteAllObjects(): Observable<T[] | null>;
    getDeleteAllSuccess(): Observable<ModelDeleteAllSuccessAction<T>>;
    getDeleteError(): Observable<ModelError | null>;
    getDeleteId(): Observable<number | null>;
    getDeleteLoading(): Observable<boolean>;
    getDeleteObject(): Observable<T | null>;
    getDeleteSuccess(): Observable<ModelDeleteSuccessAction<T>>;
    getGetError(): Observable<ModelError | null>;
    getGetId(): Observable<number | null>;
    getGetLoading(): Observable<boolean>;
    getGetObject(): Observable<T | null>;
    getGetOptions(): Observable<ModelGetParams>;
    getListCurrentStart(): Observable<number>;
    getListError(): Observable<ModelError | null>;
    getListHasNext(): Observable<boolean>;
    getListLoading(): Observable<boolean>;
    getListObjects(): Observable<ModelListResult<T> | null>;
    getListOptions(): Observable<ModelListParams>;
    getPatchError(): Observable<ModelError | null>;
    getPatchId(): Observable<number | null>;
    getPatchLoading(): Observable<boolean>;
    getPatchObject(): Observable<T | null>;
    getPatchSuccess(): Observable<ModelUpdateSuccessAction<T>>;
    getQueryCurrentStart(): Observable<number>;
    getQueryError(): Observable<ModelError | null>;
    getQueryHasNext(): Observable<boolean>;
    getQueryLoading(): Observable<boolean>;
    getQueryObjects(): Observable<ModelListResult<T> | null>;
    getQueryOptions(): Observable<ModelQueryParams | null>;
    getUpdateError(): Observable<ModelError | null>;
    getUpdateId(): Observable<number | null>;
    getUpdateLoading(): Observable<boolean>;
    getUpdateObject(): Observable<T | null>;
    getUpdateSuccess(): Observable<ModelUpdateSuccessAction<T>>;
    list(options?: ModelListParams): Observable<ModelListResult<T>>;
    patch(data: T): Observable<T>;
    query(options: ModelQueryParams): Observable<ModelListResult<T>>;
    update(data: T): Observable<T>;
}

export declare abstract class ModelUpdateAction<T extends Model> extends ModelBaseAction {
    payload: {
        item: T;
    };
    abstract type: string;
    constructor(payload: {
        item: T;
    });
}

export declare abstract class ModelUpdateFailureAction extends ModelBaseAction {
    payload: {
        error: ModelError;
    };
    abstract type: string;
    constructor(payload: {
        error: ModelError;
    });
}

export interface ModelUpdateState<M extends Model> {
    error: ModelError | null;
    id: number | null;
    loading: boolean;
    object: M | null;
    uuid: string;
}

export declare abstract class ModelUpdateSuccessAction<T extends Model> extends ModelBaseAction {
    payload: {
        item: T;
    };
    abstract type: string;
    constructor(payload: {
        item: T;
    });
}

export interface State<M extends Model> {
    create: ModelCreateState<M>[];
    delete: ModelDeleteState<M>[];
    deleteAll: ModelDeleteAllState<M>[];
    get: ModelGetState<M>[];
    list: ModelListState<M>[];
    patch: ModelPatchState<M>[];
    query: ModelQueryState<M>[];
    update: ModelUpdateState<M>[];
}
