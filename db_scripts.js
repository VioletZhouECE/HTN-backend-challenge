const Sequelize = require('sequelize');
const path = require("path");
const Umzug = require("umzug");
require('dotenv').config();

// init db connection
const sequelize = new Sequelize(process.env.DATABADE, process.env.USERNAME, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: 'postgres'
});

//test the connection
const connectTest = () =>{
  sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
}

//run all migrations
const runMigration = () =>{
  const umzug  = new Umzug({
    storage: "sequelize",

    storageOptions: {
      sequelize: sequelize
    },

    migrations: {
      params: [
        sequelize.getQueryInterface(),
        Sequelize
      ],
      path: path.join(__dirname, "./migrations")
    }
  });

  umzug.up();
}

runMigration();