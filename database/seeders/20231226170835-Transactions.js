"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Transactions",
      [
        {
          ticketId: 1,
          date: "2024-11-01T20:00:00.000Z",
          payment: 150,
          paymentType: "cash app",
          createdAt: "2024-11-11T20:00:00.000Z",
          updatedAt: "2024-11-11T20:00:00.000Z",
        },
        {
          ticketId: 2,
          date: "2024-11-01T20:00:00.000Z",
          payment: 75,
          paymentType: "cash",
          createdAt: "2024-11-11T20:00:00.000Z",
          updatedAt: "2024-11-11T20:00:00.000Z",
        },
        {
          ticketId: 2,
          date: "2024-11-08T20:00:00.000Z",
          payment: 80,
          paymentType: "cash",
          createdAt: "2024-11-11T20:00:00.000Z",
          updatedAt: "2024-11-11T20:00:00.000Z",
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Transactions", null, {})
  },
}
