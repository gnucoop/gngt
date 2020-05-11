export declare class AuthModule {
    static ɵinj: i0.ɵɵInjectorDef<AuthModule>;
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<AuthModule, [typeof i1.LoginComponent, typeof i2.LogoutConfirmDialogComponent], [typeof i3.CommonModule, typeof i4.AuthModule, typeof i5.CommonModule, typeof i6.MatButtonModule, typeof i7.MatDialogModule, typeof i8.MatFormFieldModule, typeof i9.MatIconModule, typeof i10.MatInputModule, typeof i11.MatSnackBarModule, typeof i12.ReactiveFormsModule], [typeof i1.LoginComponent]>;
    static forRoot(options: AuthModuleOptions): ModuleWithProviders<AuthModule>;
}

export declare class LoginComponent extends CoreLoginComponent {
    get fieldsAppearance(): MatFormFieldAppearance;
    set fieldsAppearance(fieldsAppearance: MatFormFieldAppearance);
    get passwordPrefixSvgIcon(): string;
    set passwordPrefixSvgIcon(passwordPrefixSvgIcon: string);
    get passwordSuffixSvgIcon(): string;
    set passwordSuffixSvgIcon(passwordSuffixSvgIcon: string);
    get usernamePrefixSvgIcon(): string;
    set usernamePrefixSvgIcon(usernamePrefixSvgIcon: string);
    get usernameSuffixSvgIcon(): string;
    set usernameSuffixSvgIcon(usernameSuffixSvgIcon: string);
    constructor(fb: FormBuilder, store: Store<AuthState>, cdr: ChangeDetectorRef);
    static ngAcceptInputType_showLabels: BooleanInput;
    static ɵcmp: i0.ɵɵComponentDefWithMeta<LoginComponent, "gngt-login", never, { "fieldsAppearance": "fieldsAppearance"; "usernamePrefixSvgIcon": "usernamePrefixSvgIcon"; "usernameSuffixSvgIcon": "usernameSuffixSvgIcon"; "passwordPrefixSvgIcon": "passwordPrefixSvgIcon"; "passwordSuffixSvgIcon": "passwordSuffixSvgIcon"; }, {}, never, ["[gngtLoginUsername]", "[gngtLoginPassword]", "[gngtLoginAction]"]>;
    static ɵfac: i0.ɵɵFactoryDef<LoginComponent, never>;
}
