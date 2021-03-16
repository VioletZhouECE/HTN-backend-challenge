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
}

module.exports = UserService;