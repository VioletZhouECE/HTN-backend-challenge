const models = require('../models');
const UserService = require("../services/users");

exports.getAllUsers = async (req, res, next) => {
    try {
        const userServiceInstance = new UserService();
        const users = await userServiceInstance.getAllUsers();

        const response = {
            "users": users
        }
        res.status(200).json(response);
    } catch (err){
        next(err);
    }
}

//Assume that each user is uniquely identified by id
exports.getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        //validate that id is a valid uuid4
        const regex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
        if (!id.match(regex)) {
            let err = new Error(`Invalid id: ${id}`);
            err.status = 422;
            throw err;
        }

        const userServiceInstance = new UserService();
        const user = await userServiceInstance.getUserById(id);

        const response = {
            "user": user
        }
        res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}

//This endpoind should perform partial updating
//Note: if the new skill is passed in, it should be added to userSkills
exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;

        //validate that id is a valid uuid4
        const regex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
        if (!id.match(regex)) {
            let err = new Error(`Invalid id: ${id}`);
            err.status = 422;
            throw err;
        }

        //to-do: make sure that the req payload is well-formated
        const payload = req.body;

        //fetch the user
        let user = await models.users.findOne({
            where: { 'id': id },
            include: [{ model: models.skills}]
        });   

        //update skills
        if (payload.skills) {
            const newSkills = payload.skills;

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
                    //get the skillId from the skill name 
                    const skill = await models.skills.findOne({
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
        }

        //update other fields
        await user.update(payload);

        //fetch the new user data 
        const updatedUser = await models.users.findOne({
            where: { 'id': id },
            attributes: ["company", "email", "name", "phone", "picture"],
            include: [{ model: models.skills, attributes: ['name'], through: { attributes: ["rating"] } }]
        });

        //flatten the skills array
        const skills = updatedUser.skills.map(skill => {
            return {
                "name": skill.name,
                "rating": skill.usersSkills.rating
            }
        });

        user = {
            "name": updatedUser.name,
            "email": updatedUser.email,
            "skills": skills,
            "company": updatedUser.company,
            "phone": updatedUser.phone,
            "picture": updatedUser.picture
        }

        const response = {
            "user": user
        }

        res.status(200).json(response);
    } catch (err) {
        next(err);
    }
}