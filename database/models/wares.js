"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Wares extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Wares.hasMany(models.WaresTickets, {
        foreignKey: "wareId",
        as: "wares sold",
        onDelete: "CASCADE",
      })

      Wares.hasMany(models.OrdersWares, {
        foreignKey: "wareId",
        as: "wares bought",
        onDelete: "CASCADE",
      })
    }
  }
  Wares.init(
    {
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      tags: DataTypes.ARRAY(DataTypes.STRING),
      stock: DataTypes.INTEGER,
      cost: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Wares",
    }
  )
  return Wares
}
