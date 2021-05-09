const express = require('express');
const sql = require('mssql');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

// import env vars
require('dotenv').config();

// optional env
const PORT = process.env.PORT || 3000;
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

// init app
const app = express();

// init DB connection pool
app.locals.dbPool = new sql.ConnectionPool(DB_CONFIG);
app.locals.dbPoolConnect = app.locals.dbPool.connect();

// serve static content
app.use('/', express.static('./public'));

// use api routes
app.use('/api/v1/', apiRoutes);

// catch all other unexpected internal errors
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
