'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('identities', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      country_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      number_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Un numéro d'identité doit être unique
      },
      passport_id: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true, // Un numéro de passeport doit être unique
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Nom de la table utilisateurs
          key: 'id', // Clé primaire de la table utilisateurs
        },
        onDelete: 'CASCADE', // Supprimez l'identité si l'utilisateur est supprimé
        onUpdate: 'CASCADE', // Met à jour les identités si l'utilisateur est modifié
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('identities');
  },
};
