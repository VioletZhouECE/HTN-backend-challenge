const models = require("../models");

class UserService {
    constructor(){
        this.userModel = models.users;
        this.sequelize = models.sequelize;
    }

    //return an array of users
    async getAllUsers(){
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
            throw(err);
        }
    }
}

module.exports = UserService;