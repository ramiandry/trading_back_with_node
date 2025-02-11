'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Identity extends Model {
    static associate(models) {
      // Relation avec User
      Identity.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user', // Alias pour l'association
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  Identity.init(
    {
      country_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      number_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      passport_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Identity',
      tableName: 'identities',
      timestamps: true,
    }
  );

  return Identity;
};
