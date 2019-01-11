const expect = require('chai').expect;
const parser = require('../src/mssql-connection-string');

describe('#knexSetup', () => {
    it('should return knex setup', () => {
        const connectionString = 'Data Source=tcp:database.com,1433;Initial Catalog=numbers;User Id=service@database.com;Password=fjsflregewbfldsfhsew3;';
        const expectedSetup = {
            'host': 'database.com',
            'server': 'database.com',
            'database': 'numbers',
            'options': {
                'database': 'numbers',
                'encrypt': true,
                'port': '1433',
            },
            'password': 'fjsflregewbfldsfhsew3',
            'user': 'service',
        };

        const result = parser(connectionString);
        expect(result).to.deep.equal(expectedSetup);
    });

    it('should be case agnostic to the keys in the connection string', () => {
        const connectionString = 'Data souRCE=tcp:database.com,1433;Initial CataloG=numbers;User ID=service@database.com;PasswoRD=fjsflregewbfldsfhsew3;';
        const expectedSetup = {
            'host': 'database.com',
            'server': 'database.com',
            'database': 'numbers',
            'options': {
                'database': 'numbers',
                'encrypt': true,
                'port': '1433',
            },
            'password': 'fjsflregewbfldsfhsew3',
            'user': 'service',
        };

        const result = parser(connectionString);
        expect(result).to.deep.equal(expectedSetup);
    });

    it('should return user that has no @', () => {
        const connectionString = 'Data souRCE=tcp:database.com,1433;Initial CataloG=numbers;User ID=service;PasswoRD=fjsflregewbfldsfhsew3;';
        const expectedSetup = {
            'host': 'database.com',
            'server': 'database.com',
            'database': 'numbers',
            'options': {
                'database': 'numbers',
                'encrypt': true,
                'port': '1433',
            },
            'password': 'fjsflregewbfldsfhsew3',
            'user': 'service',
        };

        const result = parser(connectionString);
        expect(result).to.deep.equal(expectedSetup);
    });

    it('should return proper config when protocol is missing', () => {
        const connectionString = 'Data Source=database.com,1433;Initial Catalog=numbers;User Id=service@database.com;Password=fjsflregewbfldsfhsew3;';
        const expectedSetup = {
            'host': 'database.com',
            'server': 'database.com',
            'database': 'numbers',
            'options': {
                'database': 'numbers',
                'encrypt': true,
                'port': '1433',
            },
            'password': 'fjsflregewbfldsfhsew3',
            'user': 'service',
        };

        const result = parser(connectionString);
        expect(result).to.deep.equal(expectedSetup);
    });

    it('should return proper config when port is missing', () => {
        const connectionString = 'Data Source=tcp:database.com;Initial Catalog=numbers;User Id=service@database.com;Password=fjsflregewbfldsfhsew3;';
        const expectedSetup = {
            'host': 'database.com',
            'server': 'database.com',
            'database': 'numbers',
            'options': {
                'database': 'numbers',
                'encrypt': true,
            },
            'password': 'fjsflregewbfldsfhsew3',
            'user': 'service',
        };

        const result = parser(connectionString);
        expect(result).to.deep.equal(expectedSetup);
    });

    it('should return proper config when protocol and port are missing', () => {
        const connectionString = 'Data Source=database.com;Initial Catalog=numbers;User Id=service@database.com;Password=fjsflregewbfldsfhsew3;';
        const expectedSetup = {
            'host': 'database.com',
            'server': 'database.com',
            'database': 'numbers',
            'options': {
                'database': 'numbers',
                'encrypt': true,
            },
            'password': 'fjsflregewbfldsfhsew3',
            'user': 'service',
        };

        const result = parser(connectionString);
        expect(result).to.deep.equal(expectedSetup);
    });
    it('should allow enclosed values in single quotes', () => {
        const connectionString = 'Data Source=database.com;Initial Catalog=\'numbers\';User Id=service;Password=fjsflregewbfldsfhsew3;';
        const expectedSetup = {
            'host': 'database.com',
            'server': 'database.com',
            'database': 'numbers',
            'options': {
                'database': 'numbers',
                'encrypt': true
            },
            'password': 'fjsflregewbfldsfhsew3',
            'user': 'service',
        };

        const result = parser(connectionString);
        expect(result).to.deep.equal(expectedSetup);
    });
    it('should allow enclosed values in double quotes', () => {
        const connectionString = 'Data Source=database.com;Initial Catalog="numbers";User Id=service;Password=fjsflregewbfldsfhsew3;';
        const expectedSetup = {
            'host': 'database.com',
            'server': 'database.com',
            'database': 'numbers',
            'options': {
                'database': 'numbers',
                'encrypt': true
            },
            'password': 'fjsflregewbfldsfhsew3',
            'user': 'service',
        };

        const result = parser(connectionString);
        expect(result).to.deep.equal(expectedSetup);
    });
    it('should trim trailing and leading whitespace', () => {
        const connectionString = 'Data Source=database.com;   Initial Catalog =  numbers ;User Id=service;Password=fjsflregewbfldsfhsew3;';
        const expectedSetup = {
            'host': 'database.com',
            'server': 'database.com',
            'database': 'numbers',
            'options': {
                'database': 'numbers',
                'encrypt': true
            },
            'password': 'fjsflregewbfldsfhsew3',
            'user': 'service',
        };

        const result = parser(connectionString);
        expect(result).to.deep.equal(expectedSetup);
    });
    it('should leave trailing and leading whitespace inside quotes', () => {
        const connectionString = 'Data Source=database.com;Initial Catalog= " numbers";User Id=service;Password=fjsflregewbfldsfhsew3;';
        const expectedSetup = {
            'host': 'database.com',
            'server': 'database.com',
            'database': ' numbers',
            'options': {
                'database': ' numbers',
                'encrypt': true
            },
            'password': 'fjsflregewbfldsfhsew3',
            'user': 'service',
        };

        const result = parser(connectionString);
        expect(result).to.deep.equal(expectedSetup);
    });
    it('should allow quotes inside or closing a value without enclosing', () => {
        const connectionString = 'Data Source=database.com;Initial Catalog=numbe"rs";User Id=serv\'ice\';Password=fjsflregewbfldsfhsew3;';
        const expectedSetup = {
            'host': 'database.com',
            'server': 'database.com',
            'database': 'numbe"rs"',
            'options': {
                'database': 'numbe"rs"',
                'encrypt': true
            },
            'password': 'fjsflregewbfldsfhsew3',
            'user': 'serv\'ice\'',
        };

        const result = parser(connectionString);
        expect(result).to.deep.equal(expectedSetup);
    });
    it('should allow semicolons inside or closing a value with enclosing', () => {
        const connectionString = 'Data Source=database.com;Initial Catalog="numbe;rs;";User Id=service;Password="fjsflreg;ewbfldsfhsew3";';
        const expectedSetup = {
            'host': 'database.com',
            'server': 'database.com',
            'database': 'numbe;rs;',
            'options': {
                'database': 'numbe;rs;',
                'encrypt': true
            },
            'password': 'fjsflreg;ewbfldsfhsew3',
            'user': 'service',
        };

        const result = parser(connectionString);
        expect(result).to.deep.equal(expectedSetup);
    });

    it('should successfully parse a key with ==', () => {
        const connectionString = 'Some==Key= value;Data Source=tcp:database.com,1433;Initial Catalog=numbers;User Id=service@database.com;Password=fjsflregewbfldsfhsew3;';
        const expectedSetup = {
            'host': 'database.com',
            'server': 'database.com',
            'database': 'numbers',
            'options': {
                'database': 'numbers',
                'encrypt': true,
                'port': '1433',
            },
            'password': 'fjsflregewbfldsfhsew3',
            'user': 'service',
        };

        const result = parser(connectionString);
        expect(result).to.deep.equal(expectedSetup);
    });

    it('should fail on parsing a plain value with a =', () => {
        const connectionString = 'SomeKey= va=lue;Data Source=tcp:database.com,1433;Initial Catalog=numbers;User Id=service@database.com;Password=fjsflregewbfldsfhsew3;';
        const result = ()=>parser(connectionString);
        expect(result).to.throw(/^Expected ";"/);
    });
});
