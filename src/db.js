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
const QUERY_LIMIT = parseInt(process.env.QUERY_LIMIT) || 500;

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

    return returnSingle(result, 'userId');
}

async function getIdFromUserName(userName) {
    const query = (await connect())
        .input('userName', sql.NVarChar(255), userName)
        .execute('getIdFromUserName');
    const result = await query;

    return returnSingle(result, 'userId');
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
        twitter = null,
        picture = null,
        companyRole = null,
        victories = null,
        defeats = null,
        score = null,
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
        .input('victories', sql.Int, victories)
        .input('defeats', sql.Int, defeats)
        .input('score', sql.Int, score)
        .execute('modifyUser');
    await query;
}

async function getTopUserData() {
    const query = (await connect()).execute('getTopUsers');
    const result = await query;
    return result.recordset;
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

async function getCountFechasIssues() {
    const query = (await connect()).execute('getCountFechasIssues');
    const result = await query;

    return result.recordset;
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

async function getUserFriendsInfo(userId) {
    const query = (await connect())
        .input('userId', sql.Int, userId)
        .execute('getUserFriendsInfo');
    const result = await query;

    return result.recordset;
}

async function areUsersFriends(userId1, userId2) {
    const query = (await connect())
        .input('userId1', sql.Int, userId1)
        .input('userId2', sql.Int, userId2)
        .execute('areUsersFriends');
    const result = await query;

    return returnSingle(result, 'status');
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

async function getUserAchievs(userId) {
    const query = (await connect())
        .input('userId', sql.Int, userId)
        .execute('getUserAchievs');
    const result = await query;

    return result.recordset;
}

async function giveUserAchiev(userId, achievId) {
    const query = (await connect())
        .input('userId', sql.Int, userId)
        .input('achievId', sql.Int, achievId)
        .execute('giveUserAchiev');
    await query;
}

async function hasUserAchiev(userId, achievId) {
    const query = (await connect())
        .input('userId', sql.Int, userId)
        .input('achievId', sql.Int, achievId)
        .execute('hasUserAchiev');
    const result = await query;

    return result.recordset[0];
}

async function queryIssues({
    limit = QUERY_LIMIT,
    page = 1,
    orderBy = null,
    orderAsc = 0,
    id = null,
    type = null,
    name = null,
    creatorEId = '',
    leadEId = '',
    reporterEId = '',
    asigneeId = 0,
    state = null,
    from = null,
    to = null,
}) {
    const query = (await connect())
        .input('limit', sql.Int, Math.min(limit, QUERY_LIMIT))
        .input('page', sql.Int, page)
        .input('orderBy', sql.NVarChar(255), orderBy)
        .input('orderAsc', sql.Int, orderAsc)
        .input('id', sql.Int, id)
        .input('type', sql.NVarChar(255), type)
        .input('name', sql.NVarChar(255), name)
        .input('creatorEId', sql.NVarChar(255), creatorEId)
        .input('leadEId', sql.NVarChar(255), leadEId)
        .input('reporterEId', sql.NVarChar(255), reporterEId)
        .input('asigneeId', sql.Int, asigneeId)
        .input('state', sql.NVarChar(255), state)
        .input('from', sql.DateTime, from && new Date(from))
        .input('to', sql.DateTime, to && new Date(to))
        .execute('queryIssues');
    const result = await query;

    return result.recordset;
}

async function querySubtasks({
    limit = QUERY_LIMIT,
    page = 1,
    orderBy = null,
    orderAsc = 0,
    id = null,
    issueId = null,
    name = null,
    creatorEId = '',
    leadEId = '',
    reporterEId = '',
    state = null,
    from = null,
    to = null,
}) {
    const query = (await connect())
        .input('limit', sql.Int, Math.min(limit, QUERY_LIMIT))
        .input('page', sql.Int, page)
        .input('orderBy', sql.NVarChar(255), orderBy)
        .input('orderAsc', sql.Int, orderAsc)
        .input('id', sql.Int, id)
        .input('issueId', sql.Int, issueId)
        .input('name', sql.NVarChar(255), name)
        .input('creatorEId', sql.NVarChar(255), creatorEId)
        .input('leadEId', sql.NVarChar(255), leadEId)
        .input('reporterEId', sql.NVarChar(255), reporterEId)
        .input('state', sql.NVarChar(255), state)
        .input('from', sql.DateTime, from && new Date(from))
        .input('to', sql.DateTime, to && new Date(to))
        .execute('querySubtasks');
    const result = await query;

    return result.recordset;
}

async function insertIssue({
    id,
    type,
    name,
    creatorEId = null,
    leadEId = null,
    reporterEId = null,
    asigneeId = null,
    state,
    startDate,
    endDate = null,
    priority,
}) {
    const query = (await connect())
        .input('id', sql.Int, id)
        .input('type', sql.NVarChar(255), type)
        .input('name', sql.NVarChar(255), name)
        .input('creatorEId', sql.NVarChar(255), creatorEId)
        .input('leadEId', sql.NVarChar(255), leadEId)
        .input('reporterEId', sql.NVarChar(255), reporterEId)
        .input('asigneeId', sql.Int, asigneeId)
        .input('state', sql.NVarChar(255), state)
        .input('startDate', sql.DateTime, new Date(startDate))
        .input('endDate', sql.DateTime, endDate && new Date(endDate))
        .input('priority', sql.NVarChar(255), priority)
        .execute('insertIssue');
    await query;
}

async function insertSubtask({
    id,
    issueId,
    name,
    creatorEId = null,
    leadEId = null,
    reporterEId = null,
    state,
    startDate,
    endDate,
}) {
    const query = (await connect())
        .input('id', sql.Int, id)
        .input('issueId', sql.Int, issueId)
        .input('name', sql.NVarChar(255), name)
        .input('creatorEId', sql.NVarChar(255), creatorEId)
        .input('leadEId', sql.NVarChar(255), leadEId)
        .input('reporterEId', sql.NVarChar(255), reporterEId)
        .input('state', sql.NVarChar(255), state)
        .input('startDate', sql.DateTime, new Date(startDate))
        .input('endDate', sql.DateTime, new Date(endDate))
        .execute('insertSubtask');
    await query;
}

async function recalcPetExperience(
    userId,
    highPrtyMult,
    mediumPrtyMult,
    issuesQtty,
    subtsksQtty
) {
    const query = (await connect())
        .input('userId', sql.Int, userId)
        .input('highPrtyMult', sql.Int, highPrtyMult)
        .input('mediumPrtyMult', sql.Int, mediumPrtyMult)
        .input('issuesQtty', sql.Int, issuesQtty)
        .input('subtsksQtty', sql.Int, subtsksQtty)
        .execute('recalcPetExperience');
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
    getCountFechasIssues,
    getUserFriendsInfo,
    areUsersFriends,
    createFriendship,
    endFriendship,
    getUserAchievs,
    giveUserAchiev,
    hasUserAchiev,
    queryIssues,
    querySubtasks,
    insertIssue,
    insertSubtask,
    getTopUserData,
    recalcPetExperience,
};
