module.exports = (sequelize, DataTypes) => {
    const UsersSkills = sequelize.define('usersSkills', {
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
  
      userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
      },

      skillId: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false
      },

      rating: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    });
  
    return UsersSkills;
  };