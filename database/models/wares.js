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
      Wares.hasMany(models.Tickets, {
        foreignKey: "wareId",
        as: "wares",
        onDelete: "CASCADE",
      })

      Wares.hasMany(models.Orders, {
        foreignKey: "wareId",
        as: "wares",
        onDelete: "CASCADE",
      })
    }
  }
  Wares.init(
    {
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      tags: DataTypes.ARRAY,
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
