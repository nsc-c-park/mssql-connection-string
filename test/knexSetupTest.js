const expect = require('chai').expect;
const parser = require('../index');

describe('#knexSetup', () => {
    it('should return knex setup', () => {
        const connectionString = "Data Source=tcp:database.com,1433;Initial Catalog=numbers;User Id=service@database.com;Password=fjsflregewbfldsfhsew3;"
        const expectedSetup = {
            "host": "database.com",
            "options": {
                "database": "numbers",
                "encrypt": true,
                "port": "1433",
            },
            "password": "fjsflregewbfldsfhsew3",
            "user": "service",
        };

        const result = parser(connectionString);
        expect(result).to.deep.equal(expectedSetup);
    });
});
