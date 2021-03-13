const uuid = require("uuid");
const models = require('../models');
const request = require('request');

const endpoint = "https://gist.githubusercontent.com/Advait-M/e45603da554150067b5c4551a2bf4419/raw/3871267406e266e9020db019327c3dd7f0fdc72e/hacker-data-2021.json";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        request(endpoint, { json: true }, async (err, res, body) => {
            if (err) { 
                console.log(err);
            }; 

            const userData = body;

            //insert users
            const insertedUsers = await models.users.bulkCreate(userData, {fields: ["id", "createdAt", "updatedAt", "company", "email", "name", "phone", "picture"]});

            //extract skills (use set to remove duplicates)
            const skillsSet = new Set();
            userData.forEach((user)=>{
                user.skills.forEach(skill=>{
                    if (!skillsSet.has(skill.name)){
                        skillsSet.add(skill.name);
                    }
                });
            });

            //convert set to an array
            let skillsArray = Array.from(skillsSet);
            skillsArray = skillsArray.map(skill=>{
                return {"name": skill};
            });
            console.log(skillsArray);

            //insert skills
            const insertedSkills = await models.skills.bulkCreate(skillsArray, {fields: ["id", "createdAt", "updatedAt", "name"]});
        })
    },
    down: async (queryInterface, Sequelize) => {
        //do nothing for now
    }
  };