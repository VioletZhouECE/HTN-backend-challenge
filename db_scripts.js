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
const runMigration = async () => {
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

runMigration();