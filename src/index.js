const express = require('express');
const app = express();
const errorHandler = require('./middleware/errorHandler');

// import env vars
require('dotenv').config();

const port = process.env.PORT || 3000;

// serve static content
app.use('/', express.static('./public'));

// use api routes
app.use('/api/v1/', require('./routes/api'));

// catch all other unexpected internal errors
app.use(require('./middleware/errorHandler'));

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
