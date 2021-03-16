const models = require("../models");
const { QueryTypes } = require('sequelize');

exports.getSkills = async (req, res, next)=>{
    //hard-coded test data
    const minFrequency = 5;
    const maxFrequency = 10;

    //It is easier to do this in the SQL way: join, aggregate, filter and sort
    const query = `SELECT COUNT(*) FROM skills
                   INNER JOIN usersSkills 
                   ON skills.id = usersSkills.skillId
                   GROUP BY skills.id
                   HAVING COUNT(*) BETWEEN ${minFrequency} AND ${maxFrequency}
                   ORDER BY COUNT(*)`;
    const result = await models.sequelize.query(query, { type: QueryTypes.SELECT });
    console.log(result);

    res.send("get skills");
}