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
          createdAt: "2024-11-11T20:00:00.000Z",
          updatedAt: "2024-11-11T20:00:00.000Z",
        },
        {
          orderId: 1,
          wareId: 3,
          amount: 1,
          cost: 350,
          createdAt: "2024-11-11T20:00:00.000Z",
          updatedAt: "2024-11-11T20:00:00.000Z",
        },
        {
          orderId: 2,
          wareId: 5,
          amount: 1,
          cost: 100,
          createdAt: "2024-11-11T20:00:00.000Z",
          updatedAt: "2024-11-11T20:00:00.000Z",
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("OrdersWares", null, {})
  },
}
