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
        trustServerCertificate: true, // change to true for local dev / self-signed certs
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

async function setUserAdmin(id, adm) {
    const query = (await connect())
        .input('id', sql.Int, id)
        .input('adm', sql.Int, adm)
        .execute('setUserAdmin');
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
        .input('twitter', sql.NVarChar(255), twitter)
        .input('picture', sql.NVarChar(255), picture)
        .input('companyRole', sql.NVarChar(255), companyRole)
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
    const query = (await connect())
        .input('id', sql.Int, id)
        .execute('isUserAdmin');
    const result = await query;

    return returnSingle(result, 'adm');
}

async function getSingleUserInfo(id) {
    const query = await (await connect())
        .input('id', sql.Int, id)
        .execute('getSingleUserInfo');
    const result = await query;

    return result.recordset[0];
}

async function getMultipleUsersInfo(idList) {
    const query = await (await connect())
        .input('idList', sql.NVarChar(sql.MAX), idList)
        .execute('getMultipleUsersInfo');
    const result = await query;

    return result.recordset;
}

async function getUserPet(userId) {
    const query = (await connect())
        .input('userId', sql.Int, userId)
        .execute('getUserPet');
    const result = await query;

    return result.recordset[0];
}

async function modifyUserPet(
    userId,
    {
        name = '',
        level = null,
        upgradePoints = null,
        experience = null,
        attack = null,
        defense = null,
        speed = null,
        maxHealth = null,
        move1 = 0,
        move2 = 0,
        move3 = 0,
        skill = null,
        type = null,
    }
) {
    const query = (await connect())
        .input('userId', sql.Int, userId)
        .input('name', sql.NVarChar(255), name)
        .input('level', sql.Int, level)
        .input('upgradePoints', sql.Int, upgradePoints)
        .input('experience', sql.Int, experience)
        .input('attack', sql.Int, attack)
        .input('defense', sql.Int, defense)
        .input('speed', sql.Int, speed)
        .input('maxHealth', sql.Int, maxHealth)
        .input('move1', sql.Int, move1)
        .input('move2', sql.Int, move2)
        .input('move3', sql.Int, move3)
        .input('skill', sql.Int, skill)
        .input('type', sql.Int, type)
        .execute('modifyUserPet');
    await query;
}

async function getFechasIssues() {
    const query = (await connect()).execute('getFechasIssues');
    const result = await query;

    return result.recordset;
}

async function getUserFriendsInfo(userId) {
    const query = (await connect())
        .input('userId', sql.Int, userId)
        .execute('getUserFriendsInfo');
    const result = await query;

    return result.recordset;
}

async function createFriendship(userId1, userId2) {
    const query = (await connect())
        .input('userId1', sql.Int, userId1)
        .input('userId2', sql.Int, userId2)
        .execute('createFriendship');
    await query;
}

async function endFriendship(userId1, userId2) {
    const query = (await connect())
        .input('userId1', sql.Int, userId1)
        .input('userId2', sql.Int, userId2)
        .execute('endFriendship');
    await query;
}

module.exports = {
    getPasswordFromEmail,
    getIdFromEmail,
    getIdFromUserName,
    createUser,
    setUserAdmin,
    modifyUser,
    removeUser,
    isUserAdmin,
    getSingleUserInfo,
    getMultipleUsersInfo,
    getUserPet,
    modifyUserPet,
    getFechasIssues,
    getUserFriendsInfo,
    createFriendship,
    endFriendship,
};
