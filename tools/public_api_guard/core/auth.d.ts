export declare const AUTH_OPTIONS: InjectionToken<AuthOptions>;

export declare type AuthActionsUnion = Init | InitUser | InitUserComplete | InitComplete | Logout | LogoutConfirmation | LogoutConfirmationDismiss;

export declare const enum AuthActionTypes {
    Init = "[Auth] Init",
    InitUser = "[Auth] Init user",
    InitUserComplete = "[Auth] Init user complete",
    InitComplete = "[Auth] Init complete",
    Logout = "[Auth] Logout",
    LogoutConfirmation = "[Auth] Logout Confirmation",
    LogoutConfirmationDismiss = "[Auth] Logout Confirmation Dismiss"
}

export declare type AuthApiActionsUnion = LoginSuccess | LoginFailure | LoginRedirect | RefreshToken;

export declare const enum AuthApiActionTypes {
    LoginSuccess = "[Auth/API] Login Success",
    LoginFailure = "[Auth/API] Login Failure",
    LoginRedirect = "[Auth/API] Login Redirect",
    RefreshToken = "[Auth/API] Refresh token"
}

export declare class AuthGuard implements CanActivate, CanActivateChild {
    constructor(_store: Store<fromAuth.State>);
    canActivate(): Observable<boolean>;
    canActivateChild(_cr: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean>;
    static ɵfac: i0.ɵɵFactoryDef<AuthGuard, never>;
    static ɵprov: i0.ɵɵInjectableDef<AuthGuard>;
}

export declare class AuthHelper {
    constructor(_store: Store<State>, _actions: Actions);
    logout(requestConfirmation?: boolean): Observable<boolean>;
    static ɵfac: i0.ɵɵFactoryDef<AuthHelper, never>;
    static ɵprov: i0.ɵɵInjectableDef<AuthHelper>;
}

export declare class AuthModule {
    static ɵinj: i0.ɵɵInjectorDef<AuthModule>;
    static ɵmod: i0.ɵɵNgModuleDefWithMeta<AuthModule, [typeof i1.LoginActionDirective, typeof i1.LoginPasswordDirective, typeof i1.LoginUsernameDirective], [typeof i2.EffectsFeatureModule, typeof i3.StoreFeatureModule], [typeof i1.LoginActionDirective, typeof i1.LoginPasswordDirective, typeof i1.LoginUsernameDirective]>;
}

export interface AuthModuleOptions {
    authConfig?: AuthOptions;
    authOptionsProvider?: Provider;
    jwtConfig?: JwtOptions;
    jwtOptionsProvider?: Provider;
    loggedInUserGetter?: () => number | null;
    loggedInUserSetter?: (id: number | null) => void;
}

export interface AuthOptions {
    disableScopes?: boolean;
    loggedInUserGetter?: () => number | null;
    loggedInUserSetter?: (id: number | null) => void;
    loginUrl: string;
    logoutUrl: string;
    meGetter?: () => User | null;
    meSetter?: (user: User | null) => void;
    meUrl: string;
    refreshTokenKey?: string;
    refreshTokenUrl: string;
    scopesPath?: string[];
    tokenKey?: string;
}

export declare class AuthService {
    constructor(_http: HttpClient, _config: AuthOptions);
    getCurrentUser(): Observable<User>;
    getLoggedInUser(): number | null;
    getMe(): User | null;
    login(credentials: Credentials): Observable<LoginResponse>;
    logout(): Observable<null>;
    refreshToken(refreshToken: string): Observable<RefreshTokenResponse>;
    static ɵfac: i0.ɵɵFactoryDef<AuthService, never>;
    static ɵprov: i0.ɵɵInjectableDef<AuthService>;
}

export interface AuthState {
    loginPage: fromLoginPage.State;
    status: fromAuth.State;
}

export declare abstract class AuthUserInteractionsService {
    abstract askLogoutConfirm(): Observable<boolean>;
    abstract showLoginError(error: string): void;
}

export interface Credentials {
    password: string;
    username: string;
}

export declare const getInit: MemoizedSelector<State, boolean>;

export declare const getLoggedIn: MemoizedSelector<State, boolean>;

export declare const getLoginPageError: MemoizedSelector<State, string | null>;

export declare const getLoginPagePending: MemoizedSelector<State, boolean>;

export declare const getUser: MemoizedSelector<State, User | null>;

export declare class Init implements Action {
    readonly type = AuthActionTypes.Init;
}

export declare class InitComplete implements Action {
    readonly type = AuthActionTypes.InitComplete;
}

export declare class InitUser implements Action {
    readonly type = AuthActionTypes.InitUser;
}

export declare class InitUserComplete implements Action {
    payload: {
        user: User | null;
    };
    readonly type = AuthActionTypes.InitUserComplete;
    constructor(payload: {
        user: User | null;
    });
}

export declare const JWT_OPTIONS: InjectionToken<JwtOptions>;

export declare class JwtHelperService {
    refreshTokenGetter: () => string | null;
    refreshTokenSetter: (refreshToken: string | null) => void;
    tokenGetter: () => string | null;
    tokenSetter: (token: string | null) => void;
    constructor(config: JwtOptions);
    decodeToken(token?: string | null): JwtToken | null;
    getTokenExpirationDate(token?: string | null): Date | null;
    isTokenExpired(token?: string | null, offsetSeconds?: number): boolean;
    urlBase64Decode(str: string): string;
    static ɵfac: i0.ɵɵFactoryDef<JwtHelperService, never>;
    static ɵprov: i0.ɵɵInjectableDef<JwtHelperService>;
}

export declare class JwtInterceptor implements HttpInterceptor {
    authScheme: string;
    blacklistedRoutes: (string | RegExp)[];
    headerName: string;
    jwtHelper: JwtHelperService;
    skipWhenExpired: boolean;
    throwNoTokenError: boolean;
    tokenGetter: (() => string | null) | undefined;
    whitelistedDomains: (string | RegExp)[];
    constructor(config: JwtOptions, jwtHelper: JwtHelperService);
    handleInterception(token: string | null, request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
    isBlacklistedRoute(request: HttpRequest<any>): boolean;
    isWhitelistedDomain(request: HttpRequest<any>): boolean;
    static ɵfac: i0.ɵɵFactoryDef<JwtInterceptor, never>;
    static ɵprov: i0.ɵɵInjectableDef<JwtInterceptor>;
}

export interface JwtOptions {
    authScheme?: string;
    blacklistedRoutes?: string[];
    headerName?: string;
    refreshTokenGetter?: () => string | null;
    refreshTokenSetter?: (refreshToken: string | null) => void;
    skipWhenExpired?: boolean;
    throwNoTokenError?: boolean;
    tokenGetter?: () => string | null;
    tokenSetter?: (token: string | null) => void;
    whitelistedDomains?: string[];
}

export interface JwtToken {
    scopes: string[];
    user_id: number;
}

export declare class LoginActionDirective {
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<LoginActionDirective, "[gngtLoginAction]", never, {}, {}, never>;
    static ɵfac: i0.ɵɵFactoryDef<LoginActionDirective, never>;
}

export declare abstract class LoginComponent implements OnDestroy {
    protected _cdr: ChangeDetectorRef;
    get disabled(): boolean;
    set disabled(disabled: boolean);
    readonly loginForm: FormGroup;
    get passwordPlaceholder(): string;
    set passwordPlaceholder(passwordPlaceholder: string);
    get showLabels(): boolean;
    set showLabels(showLabels: boolean);
    get usernamePlaceholder(): string;
    set usernamePlaceholder(usernamePlaceholder: string);
    readonly valid: Observable<boolean>;
    constructor(fb: FormBuilder, store: Store<fromAuth.State>, _cdr: ChangeDetectorRef);
    login(): void;
    ngOnDestroy(): void;
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<LoginComponent, never, never, { "disabled": "disabled"; "usernamePlaceholder": "usernamePlaceholder"; "passwordPlaceholder": "passwordPlaceholder"; "showLabels": "showLabels"; }, {}, never>;
    static ɵfac: i0.ɵɵFactoryDef<LoginComponent, never>;
}

export declare class LoginFailure implements Action {
    payload: {
        error: any;
    };
    readonly type = AuthApiActionTypes.LoginFailure;
    constructor(payload: {
        error: any;
    });
}

export declare class LoginPasswordDirective {
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<LoginPasswordDirective, "[gngtLoginPassword]", never, {}, {}, never>;
    static ɵfac: i0.ɵɵFactoryDef<LoginPasswordDirective, never>;
}

export declare class LoginRedirect implements Action {
    readonly type = AuthApiActionTypes.LoginRedirect;
}

export interface LoginResponse {
    user: User;
}

export declare class LoginSuccess implements Action {
    payload: LoginResponse;
    readonly type = AuthApiActionTypes.LoginSuccess;
    constructor(payload: LoginResponse);
}

export declare class LoginUsernameDirective {
    static ɵdir: i0.ɵɵDirectiveDefWithMeta<LoginUsernameDirective, "[gngtLoginUsername]", never, {}, {}, never>;
    static ɵfac: i0.ɵɵFactoryDef<LoginUsernameDirective, never>;
}

export declare class Logout implements Action {
    readonly type = AuthActionTypes.Logout;
}

export declare class LogoutConfirmation implements Action {
    readonly type = AuthActionTypes.LogoutConfirmation;
}

export declare class LogoutConfirmationDismiss implements Action {
    readonly type = AuthActionTypes.LogoutConfirmationDismiss;
}

export declare const reducers: ActionReducerMap<AuthState, AuthApiActionsUnion>;

export declare class RefreshToken implements Action {
    payload: {
        refreshDelay: number;
        fromInit?: boolean;
    };
    readonly type = AuthApiActionTypes.RefreshToken;
    constructor(payload: {
        refreshDelay: number;
        fromInit?: boolean;
    });
}

export declare const selectAuthState: MemoizedSelector<State, AuthState>;

export declare const selectAuthStatusState: MemoizedSelector<State, fromAuth.State>;

export declare const selectLoginPageState: MemoizedSelector<State, fromLoginPage.State>;

export interface State extends fromRoot.State {
    auth: AuthState;
}

export interface User {
    id: number;
    username: string;
}
