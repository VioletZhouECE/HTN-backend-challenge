const Sequelize = require('sequelize');
const path = require("path");
const Umzug = require("umzug");
require('dotenv').config();

const setup = async() => {
  const sequelize = await connect;
  console.log(sequelize);
  await runMigrations(sequelize);
  await runSeeders(sequelize);
}

//connect to db and return a sequelize instance
//Note: use Promise here to integrate with sequelize promise-based api
const connect = new Promise((resolve, reject) => {
  console.log("Connecting to postgres...");

  // init db connection
  const sequelize = new Sequelize(process.env.DATABADE, process.env.USERNAME, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'postgres'
  });

  //test connection
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully!');
      resolve(sequelize);
    })
    .catch(err => {
      reject('Unable to connect to the database:', err);
    });
})

//run all migrations
const runMigrations = async (sequelize) => {
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
const runSeeders = async (sequelize) => {
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

module.exports = setup