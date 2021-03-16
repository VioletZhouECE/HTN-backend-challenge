const SkillService = require("../services/skills");

exports.getSkills = async (req, res, next) => {
    try {
        const minFrequency = req.query.min_frequency;
        const maxFrequency = req.query.max_frequency;

        const skillServiceInstance = new SkillService();
        const skills = await skillServiceInstance.getSkills(minFrequency, maxFrequency);

        const response = {
            "skills": skills
        }

        res.status(200).json(response);
    } catch (err) {
        if (!err.status || !err.message){
            err.status = 500;
            err.message = "Cannot get skills";
        }
        next(err);
    }
}