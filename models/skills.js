module.exports = (sequelize, DataTypes) => {
    const Skill = sequelize.define('Skill', {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },

      createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'), 
        allowNull: false
      },

      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn('NOW'),
        allowNull: false
      },

      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
    });

    //set associations
    Skill.belongsToMany(models.User, {through: "UsersSkills"});
  
    return ;
  };