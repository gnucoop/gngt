export declare class AuthModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<AuthModule, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<AuthModule>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<AuthModule, [typeof i1.LoginComponent], [typeof i2.CommonModule, typeof i3.AuthModule, typeof i4.CommonModule, typeof i5.CommonModule, typeof i6.IonicModule, typeof i7.ReactiveFormsModule], [typeof i3.AuthModule, typeof i1.LoginComponent]>;
    static forRoot(options: AuthModuleOptions): ModuleWithProviders<AuthModule>;
}

export declare class LoginComponent extends CoreLoginComponent {
    constructor(fb: FormBuilder, store: Store<AuthState>, cdr: ChangeDetectorRef);
    static ngAcceptInputType_showLabels: BooleanInput;
    static ɵcmp: i0.ɵɵComponentDeclaration<LoginComponent, "gngt-login", never, {}, {}, never, ["[gngtLoginUsername]", "[gngtLoginPassword]", "*", "[gngtLoginAction]"]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<LoginComponent, never>;
}
