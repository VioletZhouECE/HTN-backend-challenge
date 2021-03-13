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

            //insert into users table
            const insertedUsers = await models.users.bulkCreate(userData, { fields: ["id", "createdAt", "updatedAt", "company", "email", "name", "phone", "picture"] });

            //extract skills (use a set to filter duplicate skills)
            const skillsSet = new Set();
            userData.forEach((user) => {
                user.skills.forEach(skill => {
                    if (!skillsSet.has(skill.name)) {
                        skillsSet.add(skill.name);
                    }
                });
            });

            //convert skillsSet to an array
            let skillsArray = Array.from(skillsSet);
            skillsArray = skillsArray.map(skill => {
                return { "name": skill };
            });

            //insert into skills table
            const insertedSkills = await models.skills.bulkCreate(skillsArray, { fields: ["id", "createdAt", "updatedAt", "name"] });

            //associate userId, skillId and rating
            //[{userId1, skillId1, rating}, {userId2, skillId2, rating}]
            const userSkillsArray = [];
            let userSkillsSet = new Set();
            userData.forEach(user => {
                const username = user.name;
                const skills = user.skills;
                const userId = insertedUsers.filter((insertedUser)=>insertedUser.name == username)[0].id;

                //use a set to filter duplicate skills
                skills.forEach((skill)=>{
                    if (!userSkillsSet.has(skill.name)){
                        userSkillsSet.add(skill.name);
                        const skillId = insertedSkills.filter((insertedSkill)=>insertedSkill.name == skill.name)[0].id;
                        console.log(skillId);
                        userSkillsArray.push({
                            "userId": userId,
                            "skillId": skillId,
                            "rating": skill.rating
                        });
                    }
                });

                //empty userSkillsSet
                userSkillsSet = new Set();
            });

            //insert into usersSkills table
            const insertedUsersSkills = await models.usersSkills.bulkCreate(userSkillsArray, { fields: ["id", "createdAt", "updatedAt", "userId", "skillId", "rating"] });
        })
    },
    down: async (queryInterface, Sequelize) => {
        //do nothing for now
    }
};