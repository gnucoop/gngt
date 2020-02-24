export declare class AuthModule {
    static ɵinj: i0.ɵɵInjectorDef<AuthModule>;
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<AuthModule, [typeof i1.LoginComponent, typeof i2.LogoutConfirmDialogComponent], [typeof i3.CommonModule, typeof i4.ReactiveFormsModule, typeof i5.MatButtonModule, typeof i6.MatDialogModule, typeof i7.MatFormFieldModule, typeof i8.MatIconModule, typeof i9.MatInputModule, typeof i10.MatSnackBarModule, typeof i11.AuthModule, typeof i12.CommonModule], [typeof i1.LoginComponent]>;
    static forRoot(options: AuthModuleOptions): i0.ModuleWithProviders<AuthModule>;
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
    static ɵcmp: i0.ɵɵComponentDefWithMeta<LoginComponent, "gngt-login", never, { "fieldsAppearance": "fieldsAppearance"; "usernamePrefixSvgIcon": "usernamePrefixSvgIcon"; "usernameSuffixSvgIcon": "usernameSuffixSvgIcon"; "passwordPrefixSvgIcon": "passwordPrefixSvgIcon"; "passwordSuffixSvgIcon": "passwordSuffixSvgIcon"; }, {}, never>;
    static ɵfac: i0.ɵɵFactoryDef<LoginComponent>;
}
