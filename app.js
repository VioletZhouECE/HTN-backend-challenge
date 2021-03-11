const express = require('express');
const app = express();
const path = require('path');
require('./db_scripts');

// JSON parser:
app.use(express.json());

// test endpoint
app.get('/test', (req, res) => {
  const test_msg = {"message" : "hello world"}
  res.status(200).json(test_msg);
});

// catch-all endpoint handler
app.use((req, res) => {
  return res.status(404).send('wrong endpoint');
});

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express caught an unkown error!',
    status: 500,
    message: { err: 'An error occurred!' },
  };
  const errorObj = {...defaultErr, err};
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

module.exports = app;