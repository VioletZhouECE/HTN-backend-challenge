const models = require("../models");

class UserService {
    constructor() {
        this.userModel = models.users;
        this.skillModel = models.skills;
        this.sequelize = models.sequelize;
    }

    //return an array of user objects
    async getAllUsers() {
        try {
            //eager loading to fetch user info from all tables
            const usersData = await this.userModel.findAll({
                attributes: ["company", "email", "name", "phone", "picture"],
                include: [{ model: models.skills, attributes: ['name'], through: { attributes: ["rating"] } }]
            });

            const users = usersData.map(user => {
                //flatten the skills array
                const skills = user.skills.map(skill => {
                    return {
                        "name": skill.name,
                        "rating": skill.usersSkills.rating
                    }
                });

                return {
                    "name": user.name,
                    "email": user.email,
                    "skills": skills,
                    "company": user.company,
                    "phone": user.phone,
                    "picture": user.picture
                }
            });

            return users;
        } catch (err) {
            throw err;
        }
    }

    //return a user object
    async getUserById(id) {
        try {
            //eager loading to fetch user info from all tables
            const userData = await this.userModel.findOne({
                where: { 'id': id },
                attributes: ["company", "email", "name", "phone", "picture"],
                include: [{ model: this.skillModel, attributes: ['name'], through: { attributes: ["rating"] } }]
            });

            if (!userData) {
                let err = new Error(`Could not find a user with id: ${id}`);
                err.status = 500;
                throw err;
            }

            //flatten the skills array
            const skills = userData.skills.map(skill => {
                return {
                    "name": skill.name,
                    "rating": skill.usersSkills.rating
                }
            });

            const user = {
                "name": userData.name,
                "email": userData.email,
                "skills": skills,
                "company": userData.company,
                "phone": userData.phone,
                "picture": userData.picture
            }

            return user;
        } catch (err) {
            throw err;
        }
    }

    //update user
    async updateUser(id, payload) {
        try {
            //fetch the user
            let user = await models.users.findOne({
                where: { 'id': id },
                include: [{ model: models.skills }]
            });

            if (payload.skills) {
                await this.updateUserSkills(user, payload.skills);
            }

            //update other fields
            await user.update(payload);
        } catch (err) {
            throw err;
        }
    }

    //update or add user skills
    async updateUserSkills(user, newSkills) {
        try {
            //update or add new skills asynchronously 
            await Promise.all(newSkills.map(async (newSkill) => {
                //get the old skill instance
                const skillInstance = user.skills.filter(skill => skill.name == newSkill.name);

                //if the user already has the skill, update its rating if necessary
                if (skillInstance.length > 0) {
                    if (skillInstance[0].usersSkills.rating != newSkill.rating) {
                        await skillInstance[0].usersSkills.update({ rating: newSkill.rating });
                    }
                    //if the user does not has the skill, associate the user with the new skill
                } else {
                    //to-do: put the following code to SkillService: getSkillNameFromId
                    //get the skillId from the skill name 
                    const skill = await this.skillModel.findOne({
                        where: { 'name': newSkill.name },
                        attributes: ["id"]
                    });

                    //throw an error if skill doesn't exist
                    if (!skill) {
                        let err = new Error(`The skill: ${newSkill.name} does not exist in our database.`);
                        err.status = 500;
                        throw err;
                    };

                    //associate user with the new skill
                    await user.addSkill(skill, { through: { rating: newSkill.rating } });
                }
            }));
        } catch (err) {
            throw err;
        }
    }
}

module.exports = UserService;