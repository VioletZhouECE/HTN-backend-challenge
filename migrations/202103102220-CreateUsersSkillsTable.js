module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('usersSkills', {
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
        allowNull: false
      },
      UserId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: { model: 'users', key: 'id' }
      },
      SkillId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: { model: 'skills', key: 'id' }
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('usersSkills');
  }
};