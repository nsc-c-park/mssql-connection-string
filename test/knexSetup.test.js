const expect = require('chai').expect;
const parser = require('../index');

describe('#knexSetup', () => {
    it('should return knex setup', () => {
        const connectionString = 'Data Source=tcp:database.com,1433;Initial Catalog=numbers;User Id=service@database.com;Password=fjsflregewbfldsfhsew3;';
        const expectedSetup = {
            'host': 'database.com',
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
            'options': {
                'database': 'numbers',
                'encrypt': true,
                'port': undefined,
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
            'options': {
                'database': 'numbers',
                'encrypt': true,
                'port': undefined,
            },
            'password': 'fjsflregewbfldsfhsew3',
            'user': 'service',
        };

        const result = parser(connectionString);
        expect(result).to.deep.equal(expectedSetup);
    });

});
