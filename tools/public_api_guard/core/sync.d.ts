export interface LocalDoc<T extends Model> {
    _id?: string;
    object: T;
    object_id: number;
    table_name: string;
}

export declare class OfflineInterceptor implements HttpInterceptor {
    constructor(_syncService: SyncService);
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
    static ɵfac: i0.ɵɵFactoryDef<OfflineInterceptor, never>;
    static ɵprov: i0.ɵɵInjectableDef<OfflineInterceptor>;
}

export declare const SYNC_OPTIONS: InjectionToken<SyncOptions>;

export interface SyncEntry {
    entry_type: SyncEntryType;
    id: number;
    object?: any;
    object_id: number;
    table_name: string;
}

export declare type SyncEntryType = 'insert' | 'update' | 'delete';

export declare class SyncModule {
    static ɵinj: i0.ɵɵInjectorDef<SyncModule>;
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<SyncModule, never, never, never>;
    static forRoot(opts: SyncOptions): i0.ModuleWithProviders<SyncModule>;
}

export interface SyncOptions {
    baseUrl: string;
    changesBatchSize?: number;
    changesPath?: string;
    docsPath?: string;
    localDatabaseName: string;
    syncInterval?: number;
}

export declare class SyncService {
    readonly status: Observable<SyncStatus>;
    constructor(_opts: SyncOptions, _httpClient: HttpClient);
    create(tableName: string, object: any): Observable<any>;
    delete(tableName: string, id: number): Observable<any>;
    deleteAll(tableName: string, ids: number[]): Observable<any[]>;
    get(tableName: string, params: ModelGetParams): Observable<any>;
    list(tableName: string, params: ModelListParams): Observable<ModelListResult<any>>;
    query(tableName: string, params: ModelQueryParams): Observable<ModelListResult<any>>;
    registerSyncModel(endPoint: string, tableName: string): void;
    start(immediate?: boolean): void;
    stop(): void;
    update(tableName: string, id: number, object: any): Observable<any>;
    static ɵfac: i0.ɵɵFactoryDef<SyncService, never>;
    static ɵprov: i0.ɵɵInjectableDef<SyncService>;
}

export declare type SyncStatus = SyncStatusInitializing | SyncStatusPaused | SyncStatusSyncing | SyncStatusError;

export interface SyncStatusError extends BaseSyncStatus {
    error: string;
    status: 'error';
}

export interface SyncStatusInitializing extends BaseSyncStatus {
    status: 'initializing';
}

export interface SyncStatusPaused extends BaseSyncStatus {
    status: 'paused';
}

export interface SyncStatusSyncing extends BaseSyncStatus {
    status: 'syncing';
}
