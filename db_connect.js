const Sequelize = require('sequelize');
require('dotenv').config();

// init db connection
const sequelize = new Sequelize(process.env.DATABADE, process.env.USERNAME, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: 'postgres'
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });