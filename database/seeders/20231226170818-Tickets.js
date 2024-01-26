"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Tickets",
      [
        {
          clientId: 2,
          cost: 391.9,
          paymentPlan: "weekly",
          createdAt: new Date("2025-01-09"),
          updatedAt: new Date("2025-01-09"),
        },
        {
          clientId: 3,
          cost: 488.52,
          paymentPlan: "biweekly",
          createdAt: new Date("2025-01-09"),
          updatedAt: new Date("2025-01-09"),
        },
        {
          clientId: 4,
          cost: 168.27,
          paymentPlan: "lump sum",
          createdAt: new Date("2025-01-13"),
          updatedAt: new Date("2025-01-13"),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Tickets", null, {})
  },
}
