"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Transactions",
      [
        {
          ticketId: 1,
          paidAt: "2024-11-01T20:00:00.000Z",
          payment: 150,
          paymentType: "cash app",
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
        {
          ticketId: 2,
          paidAt: "2024-11-01T20:00:00.000Z",
          payment: 75,
          paymentType: "cash",
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
        {
          ticketId: 2,
          paidAt: "2024-11-08T20:00:00.000Z",
          payment: 80,
          paymentType: "cash",
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Transactions", null, {})
  },
}
