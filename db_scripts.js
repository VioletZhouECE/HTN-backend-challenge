const Sequelize = require('sequelize');
const path = require("path");
const request = require('request');
const models = require('./models');
const Umzug = require("umzug");
require('dotenv').config();

const endpoint = "https://gist.githubusercontent.com/Advait-M/e45603da554150067b5c4551a2bf4419/raw/3871267406e266e9020db019327c3dd7f0fdc72e/hacker-data-2021.json";

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

// insert users to db 
const insertUsers = async () =>{
  request(endpoint, { json: true }, async (err, res, body) => {
    if (err) { 
      console.log(err);
    }; 
    await models.users.bulkCreate(body, {fields: ["id", "createdAt", "updatedAt", "company", "email", "name", "phone", "picture"]});
  });
}

//runMigration();
insertUsers();