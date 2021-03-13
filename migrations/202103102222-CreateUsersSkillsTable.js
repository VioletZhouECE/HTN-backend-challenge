module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('usersSkills', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false
      },
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
      userId: {
        type: Sequelize.UUID,
        primaryKey: true,
        references: { model: 'users', key: 'id' }
      },
      skillId: {
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