'use strict';
const parse = require('./grammar.peg.js').parse;

/**
 * Create knex setup from MS SQL Server connection string
 * @param {string} connectionString
 * @return {json}
 */
module.exports = function (connectionString) {
    const result = parseConnectionString(connectionString);

    // extract host and port from 'Data Source'
    let host;
    let port;
    ({host, port} = extractFromDataSource(result));

    // extract user from 'User Id'
    let user;
    user = extractFromUserId(result);

    // check if all data was found
    checkExtractedData(host, user, result);

    let config = {
        host, server: host,
        database: result['initial catalog'],
        options: {
            database: result['initial catalog'],
            encrypt: true
        },
        password: result['password'],
        user,
    };

    if (port) {
        config.options.port = port;
    }

    return config;
};

function extractFromUserId(result) {
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
    return user;
}

function extractFromDataSource(result) {
    let host;
    let port;
    const dataSource = result['data source'] || result['server'];
    if (dataSource) {
        const regexFull = /.*:(.*)/;
        const regexHostPort = /(.*),([0-9]+)/;
        const matchFull = regexFull.exec(dataSource);
        if (matchFull) {
            const matchHostPort = regexHostPort.exec(matchFull[1]);
            if (matchHostPort) {
                host = matchHostPort[1];
                port = matchHostPort[2];
            } else if (isNaN(matchFull[1])) {
                host = matchFull[1];
            }
        }
        else {
            const matchHostPort = regexHostPort.exec(dataSource);
            if (matchHostPort) {
                host = matchHostPort[1];
                port = matchHostPort[2];
            } else if (isNaN(dataSource)) {
                host = dataSource;
            }
        }
    }
    return {host, port};
}

function parseConnectionString(connectionString) {
    let parts = parse(connectionString);
    const result = parts.reduce((a, p) => {
        a[p[0].toLowerCase()] = p[1];
        return a;
    }, {});
    return result;
}


function checkExtractedData(host, user, result) {
    if (!host) {
        throw new Error('Host not found');
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
}