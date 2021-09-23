## API Report File for "gngt-srcs"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import { Action } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { CreateEffectMetadata } from '@ngrx/effects';
import * as fromRoot from '@gngt/core/reducers';
import { HttpClient } from '@angular/common/http';
import { InjectionToken } from '@angular/core';
import { MemoizedSelector } from '@ngrx/store';
import { Model } from '@gngt/core/common';
import { ModelGetParams } from '@gngt/core/common';
import { ModelListParams } from '@gngt/core/common';
import { ModelListResult } from '@gngt/core/common';
import { ModelManager as ModelManager_2 } from '@gngt/core/common';
import { ModelQueryParams } from '@gngt/core/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { SyncService } from '@gngt/core/sync';

// @public (undocumented)
export function createAction<A extends ModelGenericAction>(params: {
    type: string;
    payload?: any;
    uuid?: string;
}): A;

// @public (undocumented)
export function generateInitialModelState<M extends Model>(): State<M>;

// @public (undocumented)
export function generateModelActionTypes(typeName: string): ModelActionTypes;

// @public (undocumented)
export const MODEL_OPTIONS: InjectionToken<ModelOptions>;

// @public (undocumented)
export interface ModelActionTypes {
    // (undocumented)
    CREATE: string;
    // (undocumented)
    CREATE_FAILURE: string;
    // (undocumented)
    CREATE_SUCCESS: string;
    // (undocumented)
    DELETE: string;
    // (undocumented)
    DELETE_ALL: string;
    // (undocumented)
    DELETE_ALL_FAILURE: string;
    // (undocumented)
    DELETE_ALL_SUCCESS: string;
    // (undocumented)
    DELETE_FAILURE: string;
    // (undocumented)
    DELETE_SUCCESS: string;
    // (undocumented)
    GET: string;
    // (undocumented)
    GET_FAILURE: string;
    // (undocumented)
    GET_SUCCESS: string;
    // (undocumented)
    LIST: string;
    // (undocumented)
    LIST_FAILURE: string;
    // (undocumented)
    LIST_SUCCESS: string;
    // (undocumented)
    PATCH: string;
    // (undocumented)
    PATCH_FAILURE: string;
    // (undocumented)
    PATCH_SUCCESS: string;
    // (undocumented)
    QUERY: string;
    // (undocumented)
    QUERY_FAILURE: string;
    // (undocumented)
    QUERY_SUCCESS: string;
    // (undocumented)
    UPDATE: string;
    // (undocumented)
    UPDATE_FAILURE: string;
    // (undocumented)
    UPDATE_SUCCESS: string;
}

// @public (undocumented)
export abstract class ModelBaseAction implements ModelGenericAction {
    constructor(payload: any);
    // (undocumented)
    payload: any;
    // (undocumented)
    abstract type: string;
    // (undocumented)
    uuid: string;
}

// @public (undocumented)
export abstract class ModelCreateAction<T extends Model> extends ModelBaseAction {
    constructor(payload: {
        item: T;
    });
    // (undocumented)
    payload: {
        item: T;
    };
}

// @public (undocumented)
export abstract class ModelCreateFailureAction extends ModelBaseAction {
    constructor(payload: {
        error: ModelError;
    });
    // (undocumented)
    payload: {
        error: ModelError;
    };
}

// @public (undocumented)
export interface ModelCreateState<M extends Model> {
    // (undocumented)
    error: ModelError | null;
    // (undocumented)
    loading: boolean;
    // (undocumented)
    object: M | null;
    // (undocumented)
    uuid: string;
}

// @public (undocumented)
export abstract class ModelCreateSuccessAction<T extends Model> extends ModelBaseAction {
    constructor(payload: {
        item: T;
    });
    // (undocumented)
    payload: {
        item: T;
    };
}

// @public (undocumented)
export abstract class ModelDeleteAction<T extends Model> extends ModelBaseAction {
    constructor(payload: {
        item: T;
    });
    // (undocumented)
    payload: {
        item: T;
    };
}

// @public (undocumented)
export abstract class ModelDeleteAllAction<T extends Model> extends ModelBaseAction {
    constructor(payload: {
        items: T[];
    });
    // (undocumented)
    payload: {
        items: T[];
    };
}

// @public (undocumented)
export abstract class ModelDeleteAllFailureAction extends ModelBaseAction {
    constructor(payload: {
        error: ModelError;
    });
    // (undocumented)
    payload: {
        error: ModelError;
    };
}

// @public (undocumented)
export interface ModelDeleteAllState<M extends Model> {
    // (undocumented)
    error: ModelError | null;
    // (undocumented)
    ids: number[] | null;
    // (undocumented)
    loading: boolean;
    // (undocumented)
    objects: M[] | null;
    // (undocumented)
    uuid: string;
}

// @public (undocumented)
export abstract class ModelDeleteAllSuccessAction<T extends Model> extends ModelBaseAction {
    constructor(payload: {
        items: T[];
    });
    // (undocumented)
    payload: {
        items: T[];
    };
}

// @public (undocumented)
export abstract class ModelDeleteFailureAction extends ModelBaseAction {
    constructor(payload: {
        error: ModelError;
    });
    // (undocumented)
    payload: {
        error: ModelError;
    };
}

// @public (undocumented)
export interface ModelDeleteState<M extends Model> {
    // (undocumented)
    error: ModelError | null;
    // (undocumented)
    id: number | null;
    // (undocumented)
    loading: boolean;
    // (undocumented)
    object: M | null;
    // (undocumented)
    uuid: string;
}

// @public (undocumented)
export abstract class ModelDeleteSuccessAction<T extends Model> extends ModelBaseAction {
    constructor(payload: {
        item: T;
    });
    // (undocumented)
    payload: {
        item: T;
    };
}

// @public (undocumented)
export abstract class ModelEffects<M extends Model = Model, S extends fromModel.State<M> = fromModel.State<M>, A extends ModelGenericAction = ModelGenericAction, AT extends ModelActionTypes = ModelActionTypes> {
    constructor(_actions: Actions, _service: ModelService<M, S, AT>, _manager: ModelManager<M>, _actionTypes: AT);
    // (undocumented)
    protected _actions: Actions;
    // (undocumented)
    protected _manager: ModelManager<M>;
    // (undocumented)
    protected readonly modelCreate$: Observable<A> & CreateEffectMetadata;
    // (undocumented)
    protected readonly modelDelete$: Observable<A> & CreateEffectMetadata;
    // (undocumented)
    protected readonly modelDeleteAll$: Observable<A> & CreateEffectMetadata;
    // (undocumented)
    protected readonly modelGet$: Observable<A> & CreateEffectMetadata;
    // (undocumented)
    protected readonly modelList$: Observable<A> & CreateEffectMetadata;
    // (undocumented)
    protected readonly modelPatch$: Observable<A> & CreateEffectMetadata;
    // (undocumented)
    protected readonly modelQuery$: Observable<A> & CreateEffectMetadata;
    // (undocumented)
    protected readonly modelUpdate$: Observable<A> & CreateEffectMetadata;
    // (undocumented)
    protected _service: ModelService<M, S, AT>;
}

// @public
export interface ModelError {
    // (undocumented)
    message: string;
    // (undocumented)
    stack: string;
}

// @public (undocumented)
export interface ModelGenericAction extends Action {
    // (undocumented)
    payload: any;
    // (undocumented)
    readonly type: string;
    // (undocumented)
    readonly uuid: string;
}

// @public (undocumented)
export abstract class ModelGetAction extends ModelBaseAction {
    constructor(payload: {
        id: number;
    });
    // (undocumented)
    payload: {
        id: number;
    };
}

// @public (undocumented)
export abstract class ModelGetFailureAction extends ModelBaseAction {
    constructor(payload: {
        error: ModelError;
    });
    // (undocumented)
    payload: {
        error: ModelError;
    };
}

// @public (undocumented)
export interface ModelGetState<M extends Model> {
    // (undocumented)
    error: ModelError | null;
    // (undocumented)
    id: number | null;
    // (undocumented)
    loading: boolean;
    // (undocumented)
    object: M | null;
    // (undocumented)
    options: ModelGetParams;
    // (undocumented)
    uuid: string;
}

// @public (undocumented)
export abstract class ModelGetSuccessAction<T extends Model> extends ModelBaseAction {
    constructor(payload: {
        item: T;
    });
    // (undocumented)
    payload: {
        item: T;
    };
}

// @public (undocumented)
export abstract class ModelListAction extends ModelBaseAction {
    constructor(payload: {
        params: ModelListParams;
    });
    // (undocumented)
    payload: {
        params: ModelListParams;
    };
}

// @public (undocumented)
export abstract class ModelListFailureAction extends ModelBaseAction {
    constructor(payload: {
        error: ModelError;
    });
    // (undocumented)
    payload: {
        error: ModelError;
    };
}

// @public (undocumented)
export interface ModelListState<M extends Model> {
    // (undocumented)
    error: ModelError | null;
    // (undocumented)
    loading: boolean;
    // (undocumented)
    objects: ModelListResult<M> | null;
    // (undocumented)
    options: ModelListParams;
    // (undocumented)
    uuid: string;
}

// @public (undocumented)
export abstract class ModelListSuccessAction<T extends Model> extends ModelBaseAction {
    constructor(payload: {
        result: ModelListResult<T>;
    });
    // (undocumented)
    payload: {
        result: ModelListResult<T>;
    };
}

// @public (undocumented)
export abstract class ModelManager<M extends Model = Model> extends ModelManager_2 {
    constructor(config: ModelOptions, endPoint: string, _http: HttpClient, syncService?: SyncService);
    // (undocumented)
    get baseUrl(): string;
    // (undocumented)
    create(data: M): Observable<M>;
    // (undocumented)
    delete(id: number): Observable<M>;
    // (undocumented)
    deleteAll(ids: number[]): Observable<M>;
    // (undocumented)
    get(id: number): Observable<M>;
    // (undocumented)
    protected _http: HttpClient;
    // (undocumented)
    list(options?: ModelListParams): Observable<ModelListResult<M>>;
    // (undocumented)
    patch(id: number, data: M): Observable<M>;
    // (undocumented)
    query(params: ModelQueryParams): Observable<ModelListResult<M>>;
    // (undocumented)
    update(id: number, data: M): Observable<M>;
}

// @public
export interface ModelOptions {
    // (undocumented)
    addTrailingSlash?: boolean;
    // (undocumented)
    baseApiUrl: string;
    // (undocumented)
    syncModel?: boolean;
    // (undocumented)
    tableName?: string;
}

// @public (undocumented)
export interface ModelPackageState<M extends Model> {
    // (undocumented)
    [model: string]: State<M>;
}

// @public (undocumented)
export abstract class ModelPatchAction<T extends Model> extends ModelBaseAction {
    constructor(payload: {
        item: T;
    });
    // (undocumented)
    payload: {
        item: T;
    };
}

// @public (undocumented)
export abstract class ModelPatchFailureAction extends ModelBaseAction {
    constructor(payload: {
        error: ModelError;
    });
    // (undocumented)
    payload: {
        error: ModelError;
    };
}

// @public (undocumented)
export interface ModelPatchState<M extends Model> {
    // (undocumented)
    error: ModelError | null;
    // (undocumented)
    id: number | null;
    // (undocumented)
    loading: boolean;
    // (undocumented)
    object: M | null;
    // (undocumented)
    uuid: string;
}

// @public (undocumented)
export abstract class ModelPatchSuccessAction<T extends Model> extends ModelBaseAction {
    constructor(payload: {
        item: T;
    });
    // (undocumented)
    payload: {
        item: T;
    };
}

// @public (undocumented)
export abstract class ModelQueryAction extends ModelBaseAction {
    constructor(payload: {
        params: ModelQueryParams;
    });
    // (undocumented)
    payload: {
        params: ModelQueryParams;
    };
}

// @public (undocumented)
export abstract class ModelQueryFailureAction extends ModelBaseAction {
    constructor(payload: {
        error: ModelError;
    });
    // (undocumented)
    payload: {
        error: ModelError;
    };
}

// @public (undocumented)
export interface ModelQueryState<M extends Model> {
    // (undocumented)
    error: ModelError | null;
    // (undocumented)
    loading: boolean;
    // (undocumented)
    objects: ModelListResult<M> | null;
    // (undocumented)
    options: ModelQueryParams | null;
    // (undocumented)
    uuid: string;
}

// @public (undocumented)
export abstract class ModelQuerySuccessAction<T extends Model> extends ModelBaseAction {
    constructor(payload: {
        result: ModelListResult<T>;
    });
    // (undocumented)
    payload: {
        result: ModelListResult<T>;
    };
}

// @public (undocumented)
export function modelReducer<M extends Model>(state: State<M>, action: ModelBaseAction, actionTypes: ModelActionTypes): State<M>;

// @public (undocumented)
export abstract class ModelService<T extends Model = Model, S extends fromModel_2.State<T> = fromModel_2.State<T>, A extends ModelActionTypes = ModelActionTypes> {
    constructor(_store: Store<fromRoot.State>, _actions: Actions<ModelGenericAction>, _actionTypes: A, statePrefixes: [string, string]);
    // (undocumented)
    protected _actions: Actions<ModelGenericAction>;
    // (undocumented)
    create(data: Partial<T>): Observable<T>;
    // (undocumented)
    delete(data: T): Observable<T>;
    // (undocumented)
    deleteAll(data: T[]): Observable<T[]>;
    // (undocumented)
    get(id: number): Observable<T>;
    // (undocumented)
    getCreateError(): Observable<ModelError | null>;
    // (undocumented)
    getCreateLoading(): Observable<boolean>;
    // (undocumented)
    getCreateObject(): Observable<T | null>;
    // (undocumented)
    getCreateSuccess(): Observable<ModelCreateSuccessAction<T>>;
    // (undocumented)
    getDeleteAllError(): Observable<ModelError | null>;
    // (undocumented)
    getDeleteAllIds(): Observable<number[] | null>;
    // (undocumented)
    getDeleteAllLoading(): Observable<boolean>;
    // (undocumented)
    getDeleteAllObjects(): Observable<T[] | null>;
    // (undocumented)
    getDeleteAllSuccess(): Observable<ModelDeleteAllSuccessAction<T>>;
    // (undocumented)
    getDeleteError(): Observable<ModelError | null>;
    // (undocumented)
    getDeleteId(): Observable<number | null>;
    // (undocumented)
    getDeleteLoading(): Observable<boolean>;
    // (undocumented)
    getDeleteObject(): Observable<T | null>;
    // (undocumented)
    getDeleteSuccess(): Observable<ModelDeleteSuccessAction<T>>;
    // (undocumented)
    getGetError(): Observable<ModelError | null>;
    // (undocumented)
    getGetId(): Observable<number | null>;
    // (undocumented)
    getGetLoading(): Observable<boolean>;
    // (undocumented)
    getGetObject(): Observable<T | null>;
    // (undocumented)
    getGetOptions(): Observable<ModelGetParams>;
    // (undocumented)
    getListCurrentStart(): Observable<number>;
    // (undocumented)
    getListError(): Observable<ModelError | null>;
    // (undocumented)
    getListHasNext(): Observable<boolean>;
    // (undocumented)
    getListLoading(): Observable<boolean>;
    // (undocumented)
    getListObjects(): Observable<ModelListResult<T> | null>;
    // (undocumented)
    getListOptions(): Observable<ModelListParams>;
    // (undocumented)
    getPatchError(): Observable<ModelError | null>;
    // (undocumented)
    getPatchId(): Observable<number | null>;
    // (undocumented)
    getPatchLoading(): Observable<boolean>;
    // (undocumented)
    getPatchObject(): Observable<T | null>;
    // (undocumented)
    getPatchSuccess(): Observable<ModelUpdateSuccessAction<T>>;
    // (undocumented)
    getQueryCurrentStart(): Observable<number>;
    // (undocumented)
    getQueryError(): Observable<ModelError | null>;
    // (undocumented)
    getQueryHasNext(): Observable<boolean>;
    // (undocumented)
    getQueryLoading(): Observable<boolean>;
    // (undocumented)
    getQueryObjects(): Observable<ModelListResult<T> | null>;
    // (undocumented)
    getQueryOptions(): Observable<ModelQueryParams | null>;
    // (undocumented)
    getUpdateError(): Observable<ModelError | null>;
    // (undocumented)
    getUpdateId(): Observable<number | null>;
    // (undocumented)
    getUpdateLoading(): Observable<boolean>;
    // (undocumented)
    getUpdateObject(): Observable<T | null>;
    // (undocumented)
    getUpdateSuccess(): Observable<ModelUpdateSuccessAction<T>>;
    // (undocumented)
    list(options?: ModelListParams): Observable<ModelListResult<T>>;
    // (undocumented)
    protected _modelState: MemoizedSelector<object, S>;
    // (undocumented)
    patch(data: T): Observable<T>;
    // (undocumented)
    query(options: ModelQueryParams): Observable<ModelListResult<T>>;
    // (undocumented)
    protected _store: Store<fromRoot.State>;
    // (undocumented)
    update(data: T): Observable<T>;
}

// @public (undocumented)
export abstract class ModelUpdateAction<T extends Model> extends ModelBaseAction {
    constructor(payload: {
        item: T;
    });
    // (undocumented)
    payload: {
        item: T;
    };
}

// @public (undocumented)
export abstract class ModelUpdateFailureAction extends ModelBaseAction {
    constructor(payload: {
        error: ModelError;
    });
    // (undocumented)
    payload: {
        error: ModelError;
    };
}

// @public (undocumented)
export interface ModelUpdateState<M extends Model> {
    // (undocumented)
    error: ModelError | null;
    // (undocumented)
    id: number | null;
    // (undocumented)
    loading: boolean;
    // (undocumented)
    object: M | null;
    // (undocumented)
    uuid: string;
}

// @public (undocumented)
export abstract class ModelUpdateSuccessAction<T extends Model> extends ModelBaseAction {
    constructor(payload: {
        item: T;
    });
    // (undocumented)
    payload: {
        item: T;
    };
}

// @public (undocumented)
export interface State<M extends Model> {
    // (undocumented)
    create: ModelCreateState<M>[];
    // (undocumented)
    delete: ModelDeleteState<M>[];
    // (undocumented)
    deleteAll: ModelDeleteAllState<M>[];
    // (undocumented)
    get: ModelGetState<M>[];
    // (undocumented)
    list: ModelListState<M>[];
    // (undocumented)
    patch: ModelPatchState<M>[];
    // (undocumented)
    query: ModelQueryState<M>[];
    // (undocumented)
    update: ModelUpdateState<M>[];
}

// (No @packageDocumentation comment for this package)

```