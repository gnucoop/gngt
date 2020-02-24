export declare class ModelDataSource<T extends Model, S extends ModelState<T> = ModelState<T>, A extends ModelActionTypes = ModelActionTypes, MS extends ModelService<T, S, A> = ModelService<T, S, A>> extends DataSource<T> {
    get baseQueryParams(): Partial<ModelQueryParams> | null;
    set baseQueryParams(params: Partial<ModelQueryParams | null>);
    get data(): T[];
    set dataModifier(dataModifier: (data: T[]) => Observable<T[]>);
    get filter(): string;
    set filter(filter: string);
    get filters(): ModelDataSourceFilters;
    set filters(filters: ModelDataSourceFilters);
    get freeTextSearchFields(): string[];
    set freeTextSearchFields(freeTextSearchFields: string[]);
    get paginator(): MatPaginator | null;
    set paginator(paginator: MatPaginator | null);
    get sort(): MatSort | null;
    set sort(sort: MatSort | null);
    constructor(_service: MS, _baseParams?: ModelListParams);
    connect(_: CollectionViewer): Observable<T[]>;
    disconnect(_: CollectionViewer): void;
    refresh(): void;
}

export declare type ModelDataSourceFilters = {
    [key: string]: any;
};
