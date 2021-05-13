const sql = require('mssql');

/*
This module is nothing but an interface for stored procedures in the DB server
*/

// import env vars
require('dotenv').config();

// optional env
const DB_PORT = parseInt(process.env.DB_PORT) || 1433;
const DB_MAX_POOL = parseInt(process.env.DB_MAX_POOL) || 10;
const DB_MIN_POOL = parseInt(process.env.DB_MIN_POOL) || 0;
const DB_POOL_TIMEOUT = parseInt(process.env.DB_POOL_TIMEOUT) || 30000;

// required env
const DB_CONFIG = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: DB_PORT,
    database: process.env.DB_NAME,
    pool: {
        max: DB_MAX_POOL,
        min: DB_MIN_POOL,
        idleTimeoutMillis: DB_POOL_TIMEOUT,
    },
    options: {
        encrypt: true,
        trustServerCertificate: false, // change to true for local dev / self-signed certs
    },
};

// pool from which connections to the database are established
const dbPool = new sql.ConnectionPool(DB_CONFIG);
const dbPoolConnect = dbPool.connect();

// boilerplate logic to use a connection from the pool
async function connect() {
    await dbPoolConnect;
    return dbPool.request();
}

// boilerplate to return a single row on queries that SHOULD only return one
// (usually queries return an array with all the results)
function returnSingle(result, attribute) {
    return result.recordset[0] && result.recordset[0][attribute];
}

async function getPasswordFromEmail(email) {
    const query = (await connect())
        .input('email', sql.NVarChar(255), email)
        .execute('getPasswordFromEmail');
    const result = await query;

    return returnSingle(result, 'pass');
}

async function getIdFromEmail(email) {
    const query = (await connect())
        .input('email', sql.NVarChar(255), email)
        .execute('getIdFromEmail');
    const result = await query;

    return returnSingle(result, 'idUser');
}

async function getIdFromUserName(userName) {
    const query = (await connect())
        .input('userName', sql.NVarChar(255), userName)
        .execute('getIdFromUserName');
    const result = await query;

    return returnSingle(result, 'idUser');
}

async function createUser({ firstName, lastName, userName, email, passHash }) {
    const query = (await connect())
        .input('firstName', sql.NVarChar(255), firstName)
        .input('lastName', sql.NVarChar(255), lastName)
        .input('userName', sql.NVarChar(255), userName)
        .input('email', sql.NVarChar(255), email)
        .input('passHash', sql.NVarChar(255), passHash)
        .execute('createUser');
    await query;
}

async function makeAdmin(id) {
    const query = (await connect())
        .input('id', sql.Int, id)
        .execute('makeAdmin');
    await query;
}

async function unmakeAdmin(id) {
    const query = (await connect())
        .input('id', sql.Int, id)
        .execute('unmakeAdmin');
    await query;
}

async function modifyUser(
    id,
    {
        firstName = null,
        lastName = null,
        userName = null,
        email = null,
        passHash = null,
    } = {}
) {
    const query = (await connect())
        .input('id', sql.Int, id)
        .input('firstName', sql.NVarChar(255), firstName)
        .input('lastName', sql.NVarChar(255), lastName)
        .input('userName', sql.NVarChar(255), userName)
        .input('email', sql.NVarChar(255), email)
        .input('passHash', sql.NVarChar(255), passHash)
        .execute('modifyUser');
    await query;
}

async function removeUser(id) {
    const query = (await connect())
        .input('id', sql.Int, id)
        .execute('removeUser');
    await query;
}

async function isUserAdmin(id) {
    console.log(id);
    const query = (await connect())
        .input('id', sql.Int, id)
        .execute('isUserAdmin');
    const result = await query;

    return returnSingle(result, 'adm');
}

module.exports = {
    getPasswordFromEmail,
    getIdFromEmail,
    createUser,
    makeAdmin,
    unmakeAdmin,
    modifyUser,
    removeUser,
    isUserAdmin,
};
