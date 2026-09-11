export declare class PinusHttp {
    DEFAULT_HOST: string;
    DEFAULT_PORT: number;
    http: any;
    app: any;
    host: string;
    port: any;
    useSSL: boolean;
    sslOpts: any;
    beforeFilters: Function[];
    afterFilters: Function[];
    logger: any;
    server: any;
    constructor(app: any, opts: any);
    private createExpressLogger;
    private defaultLogger;
    loadRoutes(): void;
    start(cb: any): void;
    afterStart(cb: any): void;
    stop(force: any, cb: any): void;
}
