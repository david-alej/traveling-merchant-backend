"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Orders",
      [
        {
          providerId: 3,
          cost: 500,
          expectedAt: new Date("2024-11-02"),
          actualAt: new Date("2024-11-09"),
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
        {
          providerId: 1,
          cost: 110,
          expectedAt: new Date("2024-11-02"),
          actualAt: null,
          createdAt: new Date("2024-11-11"),
          updatedAt: new Date("2024-11-11"),
        },
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Orders", null, {})
  },
}
