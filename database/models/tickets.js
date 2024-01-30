"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Tickets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tickets.hasMany(models.Transactions, {
        foreignKey: "ticketId",
        as: "payments",
        onDelete: "CASCADE",
      })

      Tickets.belongsTo(models.Clients, {
        foreignKey: "clientId",
        as: "client",
      })

      Tickets.hasMany(models.WaresTickets, {
        foreignKey: "ticketId",
        as: "waresSold",
        onDelete: "CASCADE",
      })

      Tickets.belongsToMany(models.Wares, {
        foreignKey: "ticketId",
        as: "wares",
        through: models.WaresTickets,
      })
    }
  }
  Tickets.init(
    {
      clientId: DataTypes.INTEGER,
      cost: DataTypes.FLOAT,
      paymentPlan: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Tickets",
    }
  )
  return Tickets
}
