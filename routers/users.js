const {getAllUsers, getUserById, updateUser} = require()

const router = new Router();

router.get('/users', getAllUsers);

router.get('/users/:id', getUserById);

router.put('/users/:id', updateUser);

module.exports = router;