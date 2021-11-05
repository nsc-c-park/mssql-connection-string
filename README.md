[![Build Status](https://travis-ci.org/nsc-c-park/mssql-connection-string.svg?branch=master)](https://travis-ci.org/nsc-c-park/mssql-connection-string)
[![Build Status](https://ci.appveyor.com/api/projects/status/7fvfnini6t2kd7q7?svg=true)](https://ci.appveyor.com/project/jczas/mssql-connection-string)
[![Coverage Status](https://coveralls.io/repos/github/nsc-c-park/mssql-connection-string/badge.svg?branch=master)](https://coveralls.io/github/nsc-c-park/mssql-connection-string?branch=master)
[![Code Climate](https://codeclimate.com/github/nsc-c-park/mssql-connection-string.svg?branch=master)](https://codeclimate.com/github/nsc-c-park/mssql-connection-string?branch=master)
[![Issue Count](https://codeclimate.com/github/nsc-c-park/mssql-connection-string/badges/issue_count.svg)](https://codeclimate.com/github/nsc-c-park/mssql-connection-string)

MS SQL Server connection string parser
=========

A small library that parses mssql connection string and returns database configuration for given libraries:
* [knex](http://knexjs.org/)

## Installation

  `npm install mssql-connection-string`

## Usage

##### JavaScript:

    const parser = require('mssql-connection-string');

    const connectionString = "Data Source=tcp:database.com,1433;Initial Catalog=numbers;User Id=service@database.com;Password=qwerty;";

    const knexDb = parser(connectionString);

##### TypeScript:

    import parse from 'mssql-connection-string';

    const connectionString = "Data Source=tcp:database.com,1433;Initial Catalog=numbers;User Id=service@database.com;Password=qwerty;";

    const knexDb = parser(connectionString);

##### Result should be:

        {
            "host": "database.com",
            "options": {
                "database": "numbers",
                "encrypt": true,
                "port": "1433"
            },
            "password": "qwerty",
            "user": "service"
        }

The protocol and port in 'Data Source' are optional. If the 'User Id' contains an email, only the login will be used as user.

## Tests
  `npm install`
  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.
