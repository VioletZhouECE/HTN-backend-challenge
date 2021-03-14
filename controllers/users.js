const models = require('../models');

exports.getAllUsers = async (req, res, next) => {
    try {
        //eager loading to fetch all tables
        const usersData = await models.users.findAll({
            attributes: ["company", "email", "name", "phone", "picture"],
            include: [{ model: models.skills, attributes: ['name'], through: { attributes: ["rating"] } }]
        });

        const users = usersData.map(user => {
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
        })

        const response = {
            "users": users
        }

        res.status(200).json(response);
    } catch {
        throw (err);
    }
}

//Assume that each user is uniquely identified by id
exports.getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        //to-do: validate that id is a valid uuid

        const userData = await models.users.findOne({
            where: { 'id': id },
            attributes: ["company", "email", "name", "phone", "picture"],
            include: [{ model: models.skills, attributes: ['name'], through: { attributes: ["rating"] } }]
        });

        if (!userData) {
            let err = new Error(`Could not find a user with id: ${id}`);
            err.status = 500;
            throw err;
        }

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

        const response = {
            "user": user
        }

        res.status(200).json(response);
    } catch (err) {
        throw err;
    }
}

exports.updateUser = (req, res, next) => {
    res.send("update user");
}