const express = require('express');
const path = require('path');
const routes = require('./routers');
require('./db_scripts');

const app = express();

// JSON parser:
app.use(express.json());

//routers
routes(app);

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express caught an unkown error!',
    status: 500,
    message: { err: 'An error occurred!' },
  };
  const errorObj = { ...defaultErr, err };
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

module.exports = app;