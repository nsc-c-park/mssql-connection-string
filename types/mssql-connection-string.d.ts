declare module 'mssql-connection-string' {
    interface Config {
        host: string,
        server: string,
        database: string,
        options: {
            database: string,
            encrypt: boolean,
            port?: string,
        },
        password: string,
        user: string,
    }

    function parse(connectionString: string): Config;

    export = parse;
}
