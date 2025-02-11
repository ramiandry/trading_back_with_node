'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Associer User à FileUpload
      User.hasMany(models.FileUpload, {
        foreignKey: 'user_id',
        as: 'uploads', // Alias de la relation
      });

      User.hasMany(models.Identity, {
        foreignKey: 'user_id',
        as: 'identities', // Alias de la relation
      });
    }
  }

  User.init(
    {
      avatar: DataTypes.STRING,
      user_name: DataTypes.STRING,
      firstname: DataTypes.STRING,
      lastname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      is_admin: DataTypes.BOOLEAN,
      address: DataTypes.STRING,
      phone: DataTypes.STRING,
      city: DataTypes.STRING,
      line_1: DataTypes.STRING,
      line_2: DataTypes.STRING,
      postal_code: DataTypes.STRING,
      country: DataTypes.STRING,
      province: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );

  return User;
};
