export declare class CommonModule {
    static ɵinj: i0.ɵɵInjectorDef<CommonModule>;
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<CommonModule, [typeof i1.InputAriaLabelDirective], never, [typeof i1.InputAriaLabelDirective]>;
}

export declare class InputAriaLabelDirective implements AfterViewInit, OnDestroy {
    set gngtInputAriaLabel(gngtInputAriaLabel: string);
    constructor(_input: IonInput, _el: ElementRef, _renderer: Renderer2);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<InputAriaLabelDirective, "[gngtInputAriaLabel]", never, { "gngtInputAriaLabel": "gngtInputAriaLabel"; }, {}, never>;
    static ɵfac: i0.ɵɵFactoryDef<InputAriaLabelDirective>;
}
