const models = require("../models");
const { QueryTypes } = require('sequelize');

class Skill {
    constructor() {
        this.skillModel = models.skills;
        this.sequelize = models.sequelize;
    }

    //return a skills array
    //filter by two optional parameters: minFrequency and maxFrequency
    async getSkills(minFrequency, maxFrequency) {
        try {
            //construct sql filtering query based on the frequency
            let havingClause;
            if (minFrequency && maxFrequency) {
                havingClause = `HAVING count(*) BETWEEN ${minFrequency} AND ${maxFrequency}`
            } else if (minFrequency) {
                havingClause = `HAVING count(*) >= ${minFrequency}`;
            } else if (maxFrequency) {
                havingClause = `HAVING count(*) <= ${maxFrequency}`;
            } else {
                havingClause = "";
            }

            //It is easier to do this in the SQL way: join, aggregate, filter and sort
            const query = `SELECT skills.name, COUNT(*) as frequency FROM "skills"
                   INNER JOIN "usersSkills" 
                   ON "skills"."id" = "usersSkills"."skillId"
                   GROUP BY "skills"."id"
                   ${havingClause}
                   ORDER BY count(*) DESC`;

            const result = await models.sequelize.query(query, { type: QueryTypes.SELECT });

            //no skill was found
            if (result.length == 0) {
                let err = new Error(`No skill was found.`);
                err.status = 500;
                throw err;
            }

            return result;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = Skill;