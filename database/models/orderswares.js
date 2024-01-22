"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class OrdersWares extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      OrdersWares.belongsTo(models.Orders, {
        foreignKey: "orderId",
        as: "order",
        onDelete: "CASCADE",
      })

      OrdersWares.belongsTo(models.Wares, {
        foreignKey: "wareId",
        as: "wareBought",
        onDelete: "CASCADE",
      })
    }
  }
  OrdersWares.init(
    {
      wareId: DataTypes.INTEGER,
      orderId: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      cost: DataTypes.FLOAT,
      returned: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "OrdersWares",
    }
  )

  OrdersWares.removeAttribute("id")

  return OrdersWares
}
