export declare class CommonModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<CommonModule, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<CommonModule>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<CommonModule, [typeof i1.FormDisabledDirective, typeof i2.GetObjectProperty], never, [typeof i1.FormDisabledDirective, typeof i2.GetObjectProperty]>;
}

export declare function forceBooleanProp(value: any): boolean;

export declare class FormDisabledDirective {
    set disabled(disabled: boolean);
    readonly fgd: FormGroupDirective;
    constructor(fgd: FormGroupDirective);
    static ɵdir: i0.ɵɵDirectiveDeclaration<FormDisabledDirective, "[gngtFormDisabled]", never, { "disabled": "gngtFormDisabled"; }, {}, never>;
    static ɵfac: i0.ɵɵFactoryDeclaration<FormDisabledDirective, [{ host: true; self: true; }]>;
}

export declare function getObjectProperty(value: any, prop: string): any;

export declare class GetObjectProperty implements PipeTransform {
    transform(value: any, prop: string): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<GetObjectProperty, never>;
    static ɵpipe: i0.ɵɵPipeDeclaration<GetObjectProperty, "gngtGetObjectProperty">;
}

export declare function mergeQueryParams(win: Partial<ModelQueryParams>, loose: Partial<ModelQueryParams>): ModelQueryParams;

export interface Model {
    id: number;
}

export interface ModelGetParams {
    fields?: string[];
    id: number | null;
    joins?: ModelJoin[];
}

export interface ModelJoin {
    fields?: string[];
    foreignKey?: string;
    model: string;
    offlineModel?: string;
    property: string;
}

export interface ModelListParams {
    fields?: string[];
    joins?: ModelJoin[];
    limit?: number;
    sort?: ModelSort;
    start?: number;
}

export interface ModelListResult<M extends Model> {
    count: number;
    next: string | null;
    previous: string | null;
    results: M[];
}

export declare class ModelManager {
    protected _endPoint: string;
    get endPoint(): string;
    constructor(..._args: any[]);
}

export interface ModelQueryParams extends ModelListParams {
    selector: ModelQuerySelector;
}

export declare type ModelQuerySelector = {
    [propName: string]: any | {
        $lt?: any;
        $gt?: any;
        $lte?: any;
        $gte?: any;
        $eq?: any;
        $ne?: any;
        $exists?: any;
        $in?: any;
        $nin?: any;
        $or?: any;
        $nor?: any;
        $not?: any;
        $regex?: any;
    };
};

export interface ModelSort {
    [propName: string]: 'asc' | 'desc';
}
