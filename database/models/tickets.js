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
        onDelete: "CASCADE",
      })

      Tickets.belongsTo(models.Wares, {
        foreignKey: "wareId",
        as: "ware",
        onDelete: "CASCADE",
      })
    }
  }
  Tickets.init(
    {
      wareId: DataTypes.INTEGER,
      clientId: DataTypes.INTEGER,
      cost: DataTypes.FLOAT,
      paidAmount: DataTypes.FLOAT,
      paymentPlan: DataTypes.STRING,
      description: DataTypes.TEXT,
      date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Tickets",
    }
  )
  return Tickets
}
