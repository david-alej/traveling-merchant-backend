"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Tickets",
      [
        {
          clientId: 1,
          cost: 450,
          paymentPlan: "biweekly",
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
        {
          clientId: 2,
          cost: 155,
          paymentPlan: "weekly",
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Tickets", null, {})
  },
}
