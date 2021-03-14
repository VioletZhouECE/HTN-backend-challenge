const {getSkills} = require("../controllers/skills");
const express = require("express");

const router = express.Router();

router.get('/', getSkills);

module.exports = router;