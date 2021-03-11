module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define('skills', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW'),
      allowNull: false
    },

    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('NOW'),
      allowNull: false
    },

    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
  });

  //set associations
  Skill.associate = models => {
    Skill.belongsToMany(models.users, { through: "usersSkills" });
  }

  return Skill;
};