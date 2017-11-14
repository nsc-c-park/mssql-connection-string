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
            result[arr[0].toLowerCase()] = arr[1];
        }
    });

    // extract host and port from 'Data Source'
    let host;
    let port;
    const dataSource = result['data source'];
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
    const userId = result['user id'];
    if (userId) {
        const regex = /(.*)@.*/;
        const match = regex.exec(userId);
        if (match) {
            user = match[1];
        } else {
            user = userId;
        }
    }

    // check if all data was found
    if (!port || !host) {
        throw new Error('Port or host not found');
    }
    if (!user) {
        throw new Error('User not found');
    }
    if (!result['initial catalog']) {
        throw new Error('Database not found');
    }
    if (!result['password']) {
        throw new Error('Password not found');
    }

    return {
        host,
        options: {
            database: result['initial catalog'],
            encrypt: true,
            port: port,
        },
        /* tslint:disable */
        password: result['password'],
        /* tslint:enable */
        user,
    };
};
