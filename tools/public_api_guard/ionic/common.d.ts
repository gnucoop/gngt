export declare class CommonModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<CommonModule, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<CommonModule>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<CommonModule, [typeof i1.InputAriaLabelDirective], never, [typeof i1.InputAriaLabelDirective]>;
}

export declare class InputAriaLabelDirective implements AfterViewInit, OnDestroy {
    set gngtInputAriaLabel(gngtInputAriaLabel: string);
    constructor(_input: IonInput, _el: ElementRef, _renderer: Renderer2);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    static ɵdir: i0.ɵɵDirectiveDeclaration<InputAriaLabelDirective, "[gngtInputAriaLabel]", never, { "gngtInputAriaLabel": "gngtInputAriaLabel"; }, {}, never>;
    static ɵfac: i0.ɵɵFactoryDeclaration<InputAriaLabelDirective, [{ optional: true; host: true; }, null, null]>;
}
