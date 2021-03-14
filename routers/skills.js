const router = new Router();

//GET localhost:5000/skills/?min_frequency=5&max_frequency=10
router.get('/skills/*', getSkils);

router.get('/skills', wrongSkillsEndpoint);

module.exports = router;