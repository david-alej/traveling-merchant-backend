"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "OrdersWares",
      [
        {
          orderId: 1,
          wareId: 1,
          amount: 1,
          cost: 130,
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
        {
          orderId: 1,
          wareId: 3,
          amount: 1,
          cost: 350,
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
        {
          orderId: 2,
          wareId: 5,
          amount: 1,
          cost: 100,
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("OrdersWares", null, {})
  },
}
