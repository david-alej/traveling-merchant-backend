"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Orders extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Orders.belongsTo(models.Providers, {
        foreignKey: "providerId",
        as: "provider",
        onDelete: "CASCADE",
      })

      Orders.belongsTo(models.Wares, {
        foreignKey: "wareId",
        as: "ware",
        onDelete: "CASCADE",
      })
    }
  }
  Orders.init(
    {
      providerId: DataTypes.INTEGER,
      wareId: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      expectedDate: DataTypes.DATE,
      actualDate: DataTypes.DATE,
      returned: DataTypes.BOOLEAN,
      received: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Orders",
    }
  )
  return Orders
}
