const Sequelize = require('sequelize');
const path = require("path");
const request = require('request');
const models = require('./models');
const Umzug = require("umzug");
require('dotenv').config();

// init db connection
const sequelize = new Sequelize(process.env.DATABADE, process.env.USERNAME, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: 'postgres'
});

//test the connection
const connectTest = () => {
  console.log("Testing connection...");
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
const runMigrations = async () => {
  console.log("Running migrations...");

  const umzug = new Umzug({
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

  await umzug.up();

  console.log("All migrations have been executed!");
}

// insert users to db 
const runSeeders = async () => {
  console.log("Running seeders...");

  const umzug = new Umzug({
    storage: "sequelize",

    storageOptions: {
      sequelize: sequelize
    },

    migrations: {
      params: [
        sequelize.getQueryInterface(),
        Sequelize
      ],
      path: path.join(__dirname, "./seeders")
    }
  });

  await umzug.up();

  console.log("All seeders have been executed!");
}

//runMigrations();
runSeeders();