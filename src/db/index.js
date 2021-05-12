const sql = require('mssql');

// interface for stored procedures in db

async function connect(locals) {
    await locals.dbPoolConnect;
    return locals.dbPool.request();
}

async function getPasswordFromEmail(locals, email) {
    const query = (await connect(locals))
        .input('email', sql.NVarChar(255), email)
        .execute('getPasswordFromEmail');
    const result = await query;

    return result.recordset[0] && result.recordset[0].pass;
}

async function getIdFromEmail(locals, email) {
    const query = (await connect(locals))
        .input('email', sql.NVarChar(255), email)
        .execute('getIdFromEmail');
    const result = await query;

    return result.recordset[0] && result.recordset[0].idUser;
}

async function createUser(
    locals,
    firstName,
    lastName,
    userName,
    email,
    passHash
) {
    const query = (await connect(locals))
        .input('firstName', sql.NVarChar(255), firstName)
        .input('lastName', sql.NVarChar(255), lastName)
        .input('userName', sql.NVarChar(255), userName)
        .input('email', sql.NVarChar(255), email)
        .input('passHash', sql.NVarChar(255), passHash)
        .execute('createUser');
    await query;
}

async function makeAdmin(locals, id) {
    const query = (await connect(locals))
        .input('id', sql.int, id)
        .execute('makeAdmin');
    await query;
}

async function unmakeAdmin(locals, id) {
    const query = (await connect(locals))
        .input('id', sql.int, id)
        .execute('unmakeAdmin');
    await query;
}

async function modifyUser(
    locals,
    id,
    {
        firstName = null,
        lastName = null,
        userName = null,
        email = null,
        passHash = null,
    } = {}
) {
    const query = (await connect(locals))
        .input('id', sql.int, id)
        .input('firstName', sql.NVarChar(255), firstName)
        .input('lastName', sql.NVarChar(255), lastName)
        .input('userName', sql.NVarChar(255), userName)
        .input('email', sql.NVarChar(255), email)
        .input('passHash', sql.NVarChar(255), passHash)
        .execute('modifyUser');
    await query;
}

async function removeUser(locals, id) {
    const query = await connect(locals)
        .input('id', sql.int, id)
        .execute('removeUser');
    await query;
}

module.exports = {
    getPasswordFromEmail,
    getIdFromEmail,
    createUser,
    makeAdmin,
    unmakeAdmin,
    modifyUser,
    removeUser,
};
