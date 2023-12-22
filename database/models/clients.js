"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Clients extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Clients.hasMany(models.Tickets, {
        foreignKey: "clientId",
        as: "tickets",
        onDelete: "CASCADE",
      })
    }
  }
  Clients.init(
    {
      fullname: DataTypes.STRING,
      address: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      workPlace: DataTypes.STRING,
      relationship: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Clients",
    }
  )
  return Clients
}
