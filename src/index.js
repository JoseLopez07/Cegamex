const express = require('express');
const sql = require('mssql');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');

// import env vars
require('dotenv').config();

// optional env
const PORT = process.env.PORT || 3000;

// init app
const app = express();

// serve static content
app.use('/', express.static('./public'));

// use api routes
app.use('/api/v1/', apiRoutes);

// catch all other unexpected internal errors
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});
