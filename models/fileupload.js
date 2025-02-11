'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FileUpload extends Model {
    static associate(models) {
      FileUpload.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user', // Alias de la relation
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }

  FileUpload.init(
    {
      file_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      file_path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      file_type: {
        type: DataTypes.STRING,
        allowNull: false, // Obligatoire pour spécifier le type (ex: 'passport', 'cin')
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'FileUpload',
    }
  );

  return FileUpload;
};
