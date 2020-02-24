export declare class AuthModule {
    static ɵinj: i0.ɵɵInjectorDef<AuthModule>;
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<AuthModule, [typeof i1.LoginComponent], [typeof i2.CommonModule, typeof i3.ReactiveFormsModule, typeof i4.IonicModule, typeof i5.CommonModule, typeof i6.CommonModule, typeof i7.AuthModule], [typeof i1.LoginComponent, typeof i7.AuthModule]>;
    static forRoot(options: AuthModuleOptions): i0.ModuleWithProviders<AuthModule>;
}

export declare class LoginComponent extends CoreLoginComponent {
    constructor(fb: FormBuilder, store: Store<AuthState>, cdr: ChangeDetectorRef);
    static ngAcceptInputType_showLabels: BooleanInput;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<LoginComponent, "gngt-login", never, {}, {}, never>;
    static ɵfac: i0.ɵɵFactoryDef<LoginComponent>;
}
