'use strict';

/**
 * Create knex setup from MS SQL Server connection string
 * @param {string} connectionString
 * @return {json}
 */
module.exports = function (connectionString) {
    // split connection string to key=value pairs
    const result = {};
    connectionString.split(';').forEach((x) => {
        const arr = x.split('=');
        if (arr[1]) {
            result[arr[0]] = arr[1];
        }
    });

    // extract host and port from 'Data Source'
    let host;
    let port;
    const dataSource = result['Data Source'];
    if (dataSource) {
        const regex = /.*:(.*),([0-9]+)/;
        const match = regex.exec(dataSource);
        if (match) {
            host = match[1];
            port = match[2];
        }
    }

    // extract user from 'User Id'
    let user;
    const userId = result['User Id'];
    if (userId) {
        const regex = /(.*)@.*/;
        const match = regex.exec(userId);
        if (match) {
            user = match[1];
        }
    }

    // check if all data was found
    if (!port || !host) {
        throw new Error('Port or host not found');
    }
    if (!user) {
        throw new Error('User not found');
    }
    if (!result['Initial Catalog']) {
        throw new Error('Database not found');
    }
    if (!result['Password']) {
        throw new Error('Password not found');
    }

    return {
        host,
        options: {
            database: result['Initial Catalog'],
            encrypt: true,
            port: port,
        },
        /* tslint:disable */
        password: result['Password'],
        /* tslint:enable */
        user,
    };
};
