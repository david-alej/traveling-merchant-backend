"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class WaresTickets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WaresTickets.belongsTo(models.Wares, {
        foreignKey: "wareId",
        as: "ware sold",
        onDelete: "CASCADE",
      })

      WaresTickets.belongsTo(models.Tickets, {
        foreignKey: "ticketId",
        as: "ticket",
        onDelete: "CASCADE",
      })
    }
  }
  WaresTickets.init(
    {
      wareId: DataTypes.INTEGER,
      ticketId: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      returned: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "WaresTickets",
    }
  )
  return WaresTickets
}
