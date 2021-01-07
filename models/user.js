'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.Transaction, {
        as: 'transaction'
      })
    }
  };
  user.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    address: DataTypes.STRING,
    role: DataTypes.BOOLEAN,
    foto: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};