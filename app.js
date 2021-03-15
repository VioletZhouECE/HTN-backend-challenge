const express = require('express');
const path = require('path');
const routes = require('./routers');
const errorHandler = require('./middleware/errorHandler');
require('./db_scripts');

const app = express();

// JSON parser:
app.use(express.json());

//routers
routes(app);

// global error handler
app.use(errorHandler);

module.exports = app;