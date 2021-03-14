const models = require('../models');

exports.getAllUsers = async (req, res, next)=>{
    try{
        //eager loading to fetch all tables
        const usersData = await models.users.findAll({
            attributes: ["company", "email", "name", "phone", "picture"],
            include: [{model:models.skills, attributes: ['name'], through: {attributes: ["rating"]}}]
        });

        const users = usersData.map(user=>{
            const skills = user.skills.map(skill=>{
                return {
                    "name": skill.name,
                    "rating": skill.usersSkills.rating
                }
            });

            return {
                "name": user.name,
                "email": user.email,
                "skills": skills
            }
        })

        const response = {
            "users": users
        }

        res.status(200).json(response);
    } catch {
        throw (err);
    }
}

exports.getUserById = (req, res, next)=>{
    res.send("get user by id");
}

exports.updateUser = (req, res, next)=>{
    res.send("update user");
}