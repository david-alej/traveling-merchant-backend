"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "WaresTickets",
      [
        {
          wareId: 3,
          ticketId: 1,
          amount: 1,
          createdAt: "2024-11-11T20:00:00.000Z",
          updatedAt: "2024-11-11T20:00:00.000Z",
        },
        {
          wareId: 1,
          ticketId: 2,
          amount: 1,
          createdAt: "2024-11-11T20:00:00.000Z",
          updatedAt: "2024-11-11T20:00:00.000Z",
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("WaresTickets", null, {})
  },
}
