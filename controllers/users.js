const UserService = require("../services/users");

exports.getAllUsers = async (req, res, next) => {
    try {
        const userServiceInstance = new UserService();
        const users = await userServiceInstance.getAllUsers();

        const response = {
            "users": users
        }
        res.status(200).json(response);
    } catch (err) {
        if (!err.status || !err.message){
            err.status = 500;
            err.message = "Cannot get all users.";
        }
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
        if (!err.status || !err.message){
            err.status = 500;
            err.message = `Cannot get the user with id ${id}.`;
        }
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

        const userServiceInstance = new UserService();
        await userServiceInstance.updateUser(id, payload);
        const updatedUser = await userServiceInstance.getUserById(id);

        const response = {
            "user": updatedUser
        }

        res.status(200).json(response);
    } catch (err) {
        if (!err.status || !err.message){
            err.status = 500;
            err.message = "Cannot update user.";
        }
        next(err);
    }
}